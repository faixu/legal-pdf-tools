"""
Legal Bates Stamping & Permanent PDF Redaction API
Stateless, zero-disk-retention PDF processing engine in RAM.
"""
import io
import re
import json
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import fitz  # PyMuPDF

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable small glyph heights to prevent clipping of adjacent lines
fitz.TOOLS.set_small_glyph_heights(True)

app = FastAPI(
    title="Legal PDF Processor API",
    description="Bates Stamping & Permanent PDF Redaction for Legal Professionals",
    version="1.0.0",
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RedactionBox(BaseModel):
    """Visual box redaction coordinates (percentage-based)."""
    page: int = Field(..., ge=0, description="Zero-based page index")
    x_pct: float = Field(..., ge=0, le=100, description="X position as percentage of page width")
    y_pct: float = Field(..., ge=0, le=100, description="Y position as percentage of page height")
    w_pct: float = Field(..., ge=0, le=100, description="Width as percentage of page width")
    h_pct: float = Field(..., ge=0, le=100, description="Height as percentage of page height")
    label: Optional[str] = Field(None, description="Optional overlay text (e.g., 'REDACTED')")


class ProcessPDFRequest(BaseModel):
    """Request parameters for PDF processing."""
    enable_bates: bool = Field(False, description="Enable Bates numbering")
    prefix: str = Field("CASE-", description="Bates prefix (e.g., 'EXHIBIT-A-')")
    start_num: int = Field(1, ge=1, description="Starting number")
    digits: int = Field(6, ge=3, le=8, description="Zero-padding digits (3-8)")
    suffix: str = Field("", description="Optional suffix")
    position: str = Field(
        "bottom-right",
        description="Stamp position: bottom-right, bottom-left, bottom-center, top-right, top-left"
    )
    font_name: str = Field("Helvetica", description="Font: Helvetica, Courier, Times-Roman")
    font_size: float = Field(10.0, ge=6, le=24, description="Font size in points")
    margin: float = Field(24.0, ge=0, description="Margin from edge in points")
    redact_keywords: str = Field("", description="Comma-separated keywords to redact")
    redact_fill_label: str = Field("REDACTED", description="Overlay text for redactions")
    redact_pii_regex: bool = Field(False, description="Auto-detect and redact PII (SSN, ID, email)")
    redaction_boxes: str = Field("[]", description="JSON array of visual box redactions")

    @field_validator("position")
    @classmethod
    def validate_position(cls, v: str) -> str:
        valid = ["bottom-right", "bottom-left", "bottom-center", "top-right", "top-left"]
        if v not in valid:
            raise ValueError(f"Position must be one of: {valid}")
        return v

    @field_validator("font_name")
    @classmethod
    def validate_font_name(cls, v: str) -> str:
        valid = ["Helvetica", "Courier", "Times-Roman"]
        if v not in valid:
            raise ValueError(f"Font must be one of: {valid}")
        return v

    @field_validator("redaction_boxes")
    @classmethod
    def validate_redaction_boxes(cls, v: str) -> str:
        try:
            boxes = json.loads(v)
            for box in boxes:
                RedactionBox(**box)
        except json.JSONDecodeError:
            raise ValueError("redaction_boxes must be valid JSON array")
        return v


def get_font_name(font_name: str) -> str:
    """Map font name to PyMuPDF font identifier."""
    mapping = {
        "Helvetica": "helv",
        "Courier": "cour",
        "Times-Roman": "tiro",
    }
    return mapping.get(font_name, "helv")


def calculate_stamp_position(page: fitz.Page, position: str, margin: float) -> fitz.Point:
    """Calculate the insertion point for Bates stamp based on position."""
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


def apply_bates_stamping(
    doc: fitz.Document,
    prefix: str,
    start_num: int,
    digits: int,
    suffix: str,
    position: str,
    font_name: str,
    font_size: float,
    margin: float,
) -> int:
    """Apply Bates numbering to all pages. Returns the next number after stamping."""
    font = get_font_name(font_name)
    current_num = start_num

    for page in doc:
        stamp_text = f"{prefix}{str(current_num).zfill(digits)}{suffix}"
        point = calculate_stamp_position(page, position, margin)

        # Insert text at the calculated position
        page.insert_text(
            point,
            stamp_text,
            fontname=font,
            fontsize=font_size,
            color=(0, 0, 0),  # Black
            rotate=0,
        )
        current_num += 1

    return current_num


def apply_keyword_redaction(
    doc: fitz.Document,
    keywords: List[str],
    fill_label: str,
) -> int:
    """Redact all occurrences of keywords. Returns count of redactions applied."""
    count = 0
    for page in doc:
        for keyword in keywords:
            keyword = keyword.strip()
            if not keyword:
                continue
            # Search for all occurrences (case-insensitive)
            matches = page.search_for(keyword, quads=False)
            for rect in matches:
                # Trim 10% top/bottom padding
                height = rect.height
                padding = height * 0.1
                redact_rect = fitz.Rect(
                    rect.x0,
                    rect.y0 + padding,
                    rect.x1,
                    rect.y1 - padding,
                )
                # Add redaction annotation
                annot = page.add_redact_annot(redact_rect, fill=(0, 0, 0))
                if fill_label:
                    annot.set_info(title=fill_label)
                count += 1
    return count


def apply_pii_redaction(doc: fitz.Document, fill_label: str) -> int:
    """Auto-detect and redact PII patterns. Returns count of redactions applied."""
    # PII Regex patterns
    patterns = [
        (r"\b\d{3}-\d{2}-\d{4}\b", "SSN"),  # US SSN: 123-45-6789
        (r"\b\d{4}\s?\d{4}\s?\d{4}\b", "ID"),  # 12-digit ID/Aadhaar
        (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "EMAIL"),  # Email
    ]

    count = 0
    for page in doc:
        text = page.get_text()
        for pattern, pii_type in patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # Find the text location on the page
                quads = page.search_for(match.group(), quads=True)
                for quad in quads:
                    # Convert quad to rect with padding
                    rect = quad.rect
                    height = rect.height
                    padding = height * 0.1
                    redact_rect = fitz.Rect(
                        rect.x0,
                        rect.y0 + padding,
                        rect.x1,
                        rect.y1 - padding,
                    )
                    annot = page.add_redact_annot(redact_rect, fill=(0, 0, 0))
                    if fill_label:
                        annot.set_info(title=f"{fill_label} ({pii_type})")
                    count += 1
    return count


def apply_visual_box_redactions(
    doc: fitz.Document,
    boxes: List[RedactionBox],
    fill_label: str,
) -> int:
    """Apply visual box redactions based on percentage coordinates."""
    count = 0
    for box in boxes:
        if box.page >= len(doc):
            continue
        page = doc[box.page]
        rect = page.rect

        # Convert percentages to points
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


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "legal-pdf-processor"}


@app.post("/api/process-pdf")
async def process_pdf(
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
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Read file into memory
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:  # 50MB limit
        raise HTTPException(status_code=413, detail="File too large (max 50MB)")

    try:
        # Open PDF from bytes
        doc = fitz.open(stream=content, filetype="pdf")

        total_redactions = 0

        # Apply Bates stamping if enabled
        if enable_bates:
            apply_bates_stamping(
                doc, prefix, start_num, digits, suffix,
                position, font_name, font_size, margin
            )

        # Apply keyword redactions
        if redact_keywords.strip():
            keywords = [k.strip() for k in redact_keywords.split(",") if k.strip()]
            total_redactions += apply_keyword_redaction(doc, keywords, redact_fill_label)

        # Apply PII regex redactions
        if redact_pii_regex:
            total_redactions += apply_pii_redaction(doc, redact_fill_label)

        # Apply visual box redactions
        if redaction_boxes and redaction_boxes != "[]":
            boxes_data = json.loads(redaction_boxes)
            boxes = [RedactionBox(**b) for b in boxes_data]
            total_redactions += apply_visual_box_redactions(doc, boxes, redact_fill_label)

        # Apply all redactions permanently (destroy underlying text layer)
        if total_redactions > 0:
            for page in doc:
                page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)

        # Save to bytes buffer with maximum compression and garbage collection
        output_buffer = io.BytesIO()
        doc.save(
            output_buffer,
            garbage=4,      # Maximum garbage collection
            deflate=True,   # Compress streams
            clean=True,     # Clean unused objects
        )
        page_count = len(doc)
        doc.close()

        output_buffer.seek(0)

        # Generate output filename
        base_name = file.filename.rsplit(".", 1)[0]
        output_filename = f"{base_name}_processed.pdf"

        logger.info(f"Processed {file.filename}: {page_count} pages, {total_redactions} redactions")

        return StreamingResponse(
            io.BytesIO(output_buffer.getvalue()),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{output_filename}"',
                "X-Redactions-Applied": str(total_redactions),
                "X-Pages-Processed": str(page_count),
            },
        )

    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)