"""
Legal Bates Stamping & Permanent PDF Redaction API - SECURITY HARDENED
"""
import io
import re
import json
import logging
import magic  # python-magic for MIME detection
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field, field_validator, ConfigDict
import fitz  # PyMuPDF
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging - no sensitive data in logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Security configuration
ALLOWED_ORIGINS = [
    "https://legalbates.vercel.app",
    "https://legalpdftools.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Security constants
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_MIME_TYPES = ["application/pdf"]
PDF_MAGIC_BYTES = b"%PDF"

fitz.TOOLS.set_small_glyph_heights(True)

app = FastAPI(
    title="Legal PDF Processor API",
    description="Bates Stamping & Permanent PDF Redaction for Legal Professionals",
    version="1.0.0",
    docs_url="/docs" if __debug__ else None,  # Disable docs in prod
    redoc_url=None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # Never True with specific origins
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["legalbates.vercel.app", "legalpdftools.com", "localhost", "127.0.0.1"]
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data:; "
        "connect-src 'self'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    return response

# Rate limit health check
@app.get("/health")
@limiter.limit("10/minute")
async def health_check(request: Request):
    return {"status": "healthy", "service": "legal-pdf-processor"}


class RedactionBox(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    page: int = Field(..., ge=0, le=10000, description="Zero-based page index")
    x_pct: float = Field(..., ge=0, le=100, description="X position as percentage")
    y_pct: float = Field(..., ge=0, le=100, description="Y position as percentage")
    w_pct: float = Field(..., ge=0, le=100, description="Width as percentage")
    h_pct: float = Field(..., ge=0, le=100, description="Height as percentage")
    label: Optional[str] = Field(None, max_length=50, description="Overlay text")


class ProcessPDFRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    enable_bates: bool = Field(False)
    prefix: str = Field("CASE-", max_length=30, pattern=r"^[A-Za-z0-9\-_]+$")
    start_num: int = Field(1, ge=1, le=10000000)
    digits: int = Field(6, ge=3, le=8)
    suffix: str = Field("", max_length=30, pattern=r"^[A-Za-z0-9\-_]*$")
    position: str = Field("bottom-right", pattern=r"^(bottom|top)-(right|left|center)$")
    font_name: str = Field("Helvetica", pattern=r"^(Helvetica|Courier|Times-Roman)$")
    font_size: float = Field(10.0, ge=6, le=24)
    margin: float = Field(24.0, ge=0, le=144)
    redact_keywords: str = Field("", max_length=5000)
    redact_fill_label: str = Field("REDACTED", max_length=30, pattern=r"^[A-Za-z0-9\s\-_]+$")
    redact_pii_regex: bool = Field(False)
    redaction_boxes: str = Field("[]")

    @field_validator("redaction_boxes")
    @classmethod
    def validate_redaction_boxes(cls, v: str) -> List[RedactionBox]:
        try:
            boxes_data = json.loads(v)
            if not isinstance(boxes_data, list):
                raise ValueError("Must be a JSON array")
            if len(boxes_data) > 100:
                raise ValueError("Maximum 100 redaction boxes allowed")
            return [RedactionBox(**box) for box in boxes_data]
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON format")
        except Exception as e:
            raise ValueError(f"Invalid redaction boxes: {str(e)}")


# Compile regex patterns once (prevent ReDoS)
PII_PATTERNS = [
    (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"), "SSN"),
    (re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b"), "ID"),
    (re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"), "EMAIL"),
]

# Regex timeout protection
try:
    import regex  # Use regex module with timeout support
    PII_PATTERNS_TIMEOUT = [
        (regex.compile(r"\b\d{3}-\d{2}-\d{4}\b", timeout=1), "SSN"),
        (regex.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b", timeout=1), "ID"),
        (regex.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", timeout=1), "EMAIL"),
    ]
    HAS_REGEX_TIMEOUT = True
except ImportError:
    PII_PATTERNS_TIMEOUT = PII_PATTERNS
    HAS_REGEX_TIMEOUT = False


def validate_pdf_file(content: bytes) -> bool:
    """Validate PDF using magic bytes and MIME type."""
    # Check magic bytes
    if not content.startswith(PDF_MAGIC_BYTES):
        return False

    # Check MIME type using python-magic
    mime = magic.from_buffer(content, mime=True)
    return mime in ALLOWED_MIME_TYPES


def sanitize_keywords(keywords_str: str) -> List[str]:
    """Sanitize and validate keyword list."""
    if not keywords_str.strip():
        return []
    keywords = [k.strip() for k in keywords_str.split(",") if k.strip()]
    # Limit keywords and length
    sanitized = []
    for k in keywords[:50]:  # Max 50 keywords
        if len(k) <= 100 and re.match(r"^[A-Za-z0-9\s\-_\.]+$", k):
            sanitized.append(k)
    return sanitized


def get_font_name(font_name: str) -> str:
    mapping = {"Helvetica": "helv", "Courier": "cour", "Times-Roman": "tiro"}
    return mapping.get(font_name, "helv")


def calculate_stamp_position(page: fitz.Page, position: str, margin: float) -> fitz.Point:
    rect = page.rect
    width, height = rect.width, rect.height
    positions = {
        "bottom-right": fitz.Point(width - margin, height - margin),
        "bottom-left": fitz.Point(margin, height - margin),
        "bottom-center": fitz.Point(width / 2, height - margin),
        "top-right": fitz.Point(width - margin, margin),
        "top-left": fitz.Point(margin, margin),
    }
    return positions.get(position, fitz.Point(width - margin, height - margin))


def apply_bates_stamping(doc: fitz.Document, prefix: str, start_num: int,
                         digits: int, suffix: str, position: str,
                         font_name: str, font_size: float, margin: float) -> int:
    font = get_font_name(font_name)
    current_num = start_num
    for page in doc:
        stamp_text = f"{prefix}{str(current_num).zfill(digits)}{suffix}"
        point = calculate_stamp_position(page, position, margin)
        page.insert_text(point, stamp_text, fontname=font, fontsize=font_size, color=(0, 0, 0), rotate=0)
        current_num += 1
    return current_num


def apply_keyword_redaction(doc: fitz.Document, keywords: List[str], fill_label: str) -> int:
    count = 0
    for page in doc:
        for keyword in keywords:
            if not keyword:
                continue
            matches = page.search_for(keyword, quads=False)
            for rect in matches:
                height = rect.height
                padding = height * 0.1
                redact_rect = fitz.Rect(rect.x0, rect.y0 + padding, rect.x1, rect.y1 - padding)
                annot = page.add_redact_annot(redact_rect, fill=(0, 0, 0))
                if fill_label:
                    annot.set_info(title=fill_label)
                count += 1
    return count


def apply_pii_redaction(doc: fitz.Document, fill_label: str) -> int:
    count = 0
    for page in doc:
        text = page.get_text()
        patterns = PII_PATTERNS_TIMEOUT if HAS_REGEX_TIMEOUT else PII_PATTERNS
        for pattern, pii_type in patterns:
            try:
                if HAS_REGEX_TIMEOUT:
                    matches = pattern.findall(text)
                else:
                    matches = pattern.findall(text)
            except TimeoutError:
                logger.warning(f"PII regex timeout for {pii_type}")
                continue
            for match in matches:
                quads = page.search_for(match, quads=True)
                for quad in quads:
                    rect = quad.rect
                    height = rect.height
                    padding = height * 0.1
                    redact_rect = fitz.Rect(rect.x0, rect.y0 + padding, rect.x1, rect.y1 - padding)
                    annot = page.add_redact_annot(redact_rect, fill=(0, 0, 0))
                    if fill_label:
                        annot.set_info(title=f"{fill_label} ({pii_type})")
                    count += 1
    return count


def apply_visual_box_redactions(doc: fitz.Document, boxes: List[RedactionBox], fill_label: str) -> int:
    count = 0
    for box in boxes:
        if box.page >= len(doc):
            continue
        page = doc[box.page]
        rect = page.rect
        x0 = rect.width * (box.x_pct / 100)
        y0 = rect.height * (box.y_pct / 100)
        x1 = x0 + rect.width * (box.w_pct / 100)
        y1 = y0 + rect.height * (box.h_pct / 100)
        redact_rect = fitz.Rect(x0, y0, x1, y1)
        annot = page.add_redact_annot(redact_rect, fill=(0, 0, 0))
        label = box.label or fill_label
        if label:
            annot.set_info(title=label)
        count += 1
    return count


@app.post("/api/process-pdf")
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute per IP
async def process_pdf(
    request: Request,
    file: UploadFile = File(..., description="PDF file to process"),
    enable_bates: bool = Form(False),
    prefix: str = Form("CASE-"),
    start_num: int = Form(1),
    digits: int = Form(6),
    suffix: str = Form(""),
    position: str = Form("bottom-right"),
    font_name: str = Form("Helvetica"),
    font_size: float = Form(10.0),
    margin: float = Form(24.0),
    redact_keywords: str = Form(""),
    redact_fill_label: str = Form("REDACTED"),
    redact_pii_regex: bool = Form(False),
    redaction_boxes: str = Form("[]"),
):
    """
    Process PDF with Bates stamping and/or permanent redaction.
    All processing happens in RAM - zero disk retention.
    """
    # Validate file type via extension AND MIME
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Read file in chunks to enforce size limit early
    content_chunks = []
    total_size = 0
    async for chunk in file.stream():
        total_size += len(chunk)
        if total_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large (max 50MB)")
        content_chunks.append(chunk)

    content = b"".join(content_chunks)

    # Validate PDF content
    if not validate_pdf_file(content):
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    try:
        # Validate form data
        form_data = ProcessPDFRequest(
            enable_bates=enable_bates,
            prefix=prefix,
            start_num=start_num,
            digits=digits,
            suffix=suffix,
            position=position,
            font_name=font_name,
            font_size=font_size,
            margin=margin,
            redact_keywords=redact_keywords,
            redact_fill_label=redact_fill_label,
            redact_pii_regex=redact_pii_regex,
            redaction_boxes=redaction_boxes,
        )

        doc = fitz.open(stream=content, filetype="pdf")
        total_redactions = 0

        if form_data.enable_bates:
            apply_bates_stamping(doc, form_data.prefix, form_data.start_num,
                               form_data.digits, form_data.suffix, form_data.position,
                               form_data.font_name, form_data.font_size, form_data.margin)

        if form_data.redact_keywords.strip():
            keywords = sanitize_keywords(form_data.redact_keywords)
            total_redactions += apply_keyword_redaction(doc, keywords, form_data.redact_fill_label)

        if form_data.redact_pii_regex:
            total_redactions += apply_pii_redaction(doc, form_data.redact_fill_label)

        if form_data.redaction_boxes and form_data.redaction_boxes != "[]":
            boxes = json.loads(form_data.redaction_boxes)
            validated_boxes = [RedactionBox(**b) for b in boxes]
            total_redactions += apply_visual_box_redactions(doc, validated_boxes, form_data.redact_fill_label)

        if total_redactions > 0:
            for page in doc:
                page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)

        output_buffer = io.BytesIO()
        doc.save(output_buffer, garbage=4, deflate=True, clean=True)
        page_count = len(doc)
        doc.close()
        output_buffer.seek(0)

        base_name = file.filename.rsplit(".", 1)[0]
        # Sanitize filename
        safe_name = re.sub(r"[^A-Za-z0-9\-_]", "_", base_name)
        output_filename = f"{safe_name}_processed.pdf"

        logger.info(f"Processed {file.filename}: {page_count} pages, {total_redactions} redactions")

        return StreamingResponse(
            io.BytesIO(output_buffer.getvalue()),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{output_filename}"',
                "X-Redactions-Applied": str(total_redactions),
                "X-Pages-Processed": str(page_count),
                "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
            },
        )

    except RateLimitExceeded:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {type(e).__name__}")
        # Generic error message - no internal details
        raise HTTPException(status_code=500, detail="Processing failed. Please try again.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)