import { useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowLeft, Scale, Shield, FileText, Brain, Clock, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import AdSlot from '../../components/AdSlot'
import { guidePages } from '../../config/seoPages'

// Code block component with syntax highlighting
const CodeBlock = ({ code, lang = 'text' }) => (
  <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4">
    <code className={`language-${lang}`}>{code}</code>
  </pre>
)

// Inline code component
const C = ({ children }) => <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">{children}</code>

// Markdown renderer components
const MarkdownComponents = {
  h1: ({ children }) => <h1 className="section-heading text-balance">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2 mt-10"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-mono text-sm">📖</span>{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-neutral-900 mb-3 mt-8">{children}</h3>,
  p: ({ children }) => <p className="content-text whitespace-pre-wrap mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 content-text mb-4 ml-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 content-text mb-4 ml-4">{children}</ol>,
  li: ({ children }) => <li className="content-text mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-700 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children, inline }) => {
    if (inline) {
      return <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">{children}</code>
    }
    return (
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4">
        <code>{children}</code>
      </pre>
    )
  },
  strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} className="text-primary-700 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="border-neutral-200 my-8" />,
}

// Full guide content - Markdown strings
const guideContent = {
  '/guides/what-is-bates-numbering-in-legal-discovery': {
    title: 'What Is Bates Numbering in Legal Discovery? Complete Guide',
    hero: 'Bates numbering is the standardized method of sequentially labeling pages in legal document productions. Every page receives a unique identifier — typically a prefix followed by a zero-padded number — creating an unbroken chain of custody and reference.',
    markdown: `# What Is Bates Numbering in Legal Discovery? Complete Guide

Bates numbering is the standardized method of sequentially labeling pages in legal document productions. Every page receives a unique identifier — typically a prefix followed by a zero-padded number — creating an unbroken chain of custody and reference.

## History and Origins

The Bates numbering system traces to the late 19th century when Edwin G. Bates patented the "Bates Automatic Numbering Machine" in 1891. Originally a mechanical hand-stamp that advanced a counter with each impression, it revolutionized how law firms, courts, and businesses managed large document collections. Before Bates, document identification relied on ad hoc systems — page numbers, exhibit letters, or manual logs — none of which scaled to the volumes modern litigation demands.

The machine's genius was simplicity: a self-inking stamp that incremented automatically, ensuring no two pages shared the same number. By the mid-20th century, Bates machines were standard equipment in every major law firm and courthouse. The transition to digital began in the 1990s with software that could apply electronic Bates stamps to scanned documents, and today the process is fully automated — but the principles remain unchanged.

## Format Standards and Conventions

While no single universal standard governs Bates formatting, strong conventions have emerged:

### Prefix Conventions
- Case-specific: SMITH v. JONES → SJ-00001
- Party-specific: Plaintiff → P-00001, Defendant → D-00001
- Production-specific: PROD-0000001, SUPP-000001
- Exhibit-specific: EXHIBIT-A-0001, EXH-00001

### Zero-Padding Standards
- 4 digits: Standard for exhibits (0001-9999)
- 6 digits: General litigation (000001-999999)
- 7 digits: Large productions (0000001-9999999)
- 8 digits: Regulatory/SEC productions

### Placement Conventions
- Bottom-right: Most common, avoids text
- Bottom-center: Centered for symmetry
- Top-right: Court exhibits (FRCP preferred)
- Margins: 18-36pt from edge for binding clearance

## Court Rules and Compliance

Federal Rules of Civil Procedure Rule 34(b)(2)(E) requires productions to be "organized and labeled to correspond with the categories in the request." Most federal district courts have local rules specifying:

**Eastern District of Texas:** Bates numbers required on all produced documents, bottom-right, minimum 6 digits.
**Southern District of New York:** Sequential numbering, prefix identifying producing party.
**Northern District of California:** "Bates-stamped or otherwise uniquely identified" — electronic metadata acceptable.
**Delaware Chancery:** Exhibit numbers at top-right, Times New Roman 11pt minimum.

## Digital Implementation Best Practices

Modern Bates stamping requires attention to technical details that mechanical stamps never faced:

### Text Layer vs. Image Layer
True Bates stamping inserts text into the PDF's content stream — searchable, selectable, and accessible. Some tools merely overlay an image stamp, which OCR can read but text extraction cannot. Always verify your tool writes to the text layer.

### Metadata Preservation
Bates stamping should not strip existing PDF metadata (author, creation date, subject). The stamp becomes part of the document's history, not a replacement for it.

### Incremental Integrity
When supplementing productions, numbering must continue seamlessly. If Production 1 ended at PROD-0045231, Production 2 starts at 45232 — never reset to 1.

### Quality Assurance
- Spot-check 5% of pages for stamp presence and legibility
- Verify no duplicate numbers exist
- Confirm prefix consistency across entire production
- Test text extraction on stamped pages

## Common Pitfalls to Avoid
1. **Resetting counters** between productions — breaks chain of custody
2. **Insufficient padding** — PROD-1, PROD-2 sorts incorrectly in file systems
3. **Overlapping text** — Stamps covering document content
4. **Inconsistent fonts** — Mixed fonts suggest manual intervention
5. **Missing stamps** — Pages without numbers invalidate production integrity
6. **Metadata leakage** — Hidden text layers revealing redacted content`,
    faq: [
      { q: 'Can I use letters in Bates numbers?', a: 'Letters in the prefix are standard (EXHIBIT-A-). Letters within the numeric sequence (0001A) are non-standard and discouraged.' },
      { q: 'What if a page is added after stamping?', a: 'Use a suffix (00001-A) or re-stamp the entire production. Never insert a number mid-sequence.' },
      { q: 'Are electronic Bates stamps legally equivalent to physical?', a: 'Yes, provided they meet the same uniqueness and sequentiality requirements. Courts routinely accept digital stamps.' },
      { q: 'How do I handle landscape pages?', a: "Stamp in the page's native orientation. The 'bottom-right' position rotates with the page." },
    ]
  },

  '/guides/how-to-permanently-redact-pdf-without-metadata-leaks': {
    title: 'How to Permanently Redact PDFs Without Metadata Leaks',
    hero: 'True PDF redaction permanently destroys the underlying text and image data — not just covering it with a black box. Most "redaction" tools fail this test, leaving sensitive data recoverable through text extraction, metadata inspection, or forensic analysis.',
    markdown: `# How to Permanently Redact PDFs Without Metadata Leaks

True PDF redaction permanently destroys the underlying text and image data — not just covering it with a black box. Most "redaction" tools fail this test, leaving sensitive data recoverable through text extraction, metadata inspection, or forensic analysis.

## The Critical Distinction: Masking vs. Destruction

Visual masking — drawing a black rectangle over text — is not redaction. The original text remains in the PDF's content stream, fully extractable by:
- Text selection (copy/paste)
- Search functions (Ctrl+F)
- PDF text extraction libraries (pdfminer, PyMuPDF, Apache PDFBox)
- Screen readers and accessibility tools
- Forensic tools (pdf-parser, origami, peepdf)

True redaction uses PDF redaction annotations (PDF 1.7+ specification) combined with \`apply_redactions()\` which:
1. Removes the text/content objects from the page's content stream
2. Replaces the region with rasterized pixels (\`PDF_REDACT_IMAGE_PIXELS\`)
3. Sanitizes metadata references to the removed content
4. Rebuilds the PDF structure without the redacted objects

## Metadata Vectors That Leak Redacted Content

Even with proper content-stream redaction, these vectors can leak information:

### Document Metadata
- Title, Author, Subject, Keywords fields
- Creation/Modification dates
- Producer/Creator application strings
- Custom XMP metadata packets

### Hidden Layers
- Optional Content Groups (OCGs) / Layers
- Annotations (comments, highlights, stamps)
- Form fields (even hidden ones)
- Embedded files and attachments

### Structural Artifacts
- Thumbnail images (often unredacted)
- Page piece dictionaries
- Font descriptors referencing removed text
- Cross-reference tables with orphaned objects

### Search Indexes
- Embedded search indexes (AddOns)
- Text extraction caches in viewers

## PyMuPDF Redaction Architecture

Our tool uses PyMuPDF (fitz) — the same engine powering enterprise redaction solutions. The process:

\`\`\`python
# 1. Enable small glyph height protection
fitz.TOOLS.set_small_glyph_heights(True)

# 2. Search for text to redact
matches = page.search_for("SSN: 123-45-6789")

# 3. Add redaction annotations with padding
for rect in matches:
    padded = fitz.Rect(rect.x0, rect.y0 + rect.height*0.1, rect.x1, rect.y1 - rect.height*0.1)
    annot = page.add_redact_annot(padded, fill=(0, 0, 0))
    annot.set_info(title="REDACTED")

# 4. Apply redactions — destroys text layer
page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)

# 5. Save with maximum sanitization
doc.save(output, garbage=4, deflate=True, clean=True)
\`\`\`

Key parameters:
- \`garbage=4\`: Maximum object cleanup (removes unreferenced objects)
- \`deflate=True\`: Compress all streams
- \`clean=True\`: Sanitize structure
- \`PDF_REDACT_IMAGE_PIXELS\`: Rasterize redacted regions — no vector artifacts remain

## Validation Checklist
After redaction, verify:
1. **Text extraction returns nothing** for redacted regions
2. **Search finds no matches** for redacted terms
3. **File size decreases** (content removed, not just covered)
4. **Metadata fields sanitized** (author, title, keywords)
5. **No hidden layers** (check OCGs in PDF viewer)
6. **Thumbnails regenerated** (not showing original content)
7. **OCR on redacted output** yields no recoverable text

## Common Tool Failures
| Tool Category | Typical Failure |
|---|---|
| Annotation-only | Draws black box, text remains extractable |
| Image overlay | Rasterizes page but keeps text layer |
| Print-to-PDF | Loses vector quality, may keep text |
| Online converters | Upload risk, unknown processing |
| Adobe Acrobat Pro | Correct if "Apply Redactions" used; fails if only "Mark for Redaction" |`,
    faq: [
      { q: 'Can redacted content be recovered from the PDF file?', a: 'No. PDF_REDACT_IMAGE_PIXELS replaces content with pixels. The original text objects are deleted from the PDF structure. Forensic recovery is impossible.' },
      { q: 'Does this work on scanned PDFs?', a: 'Scanned PDFs are images — no text layer to redact. Run OCR first, then redact. For pure image redaction, use visual box coordinates.' },
      { q: 'What about metadata in the original file?', a: 'The \`garbage=4, clean=True\` save options strip orphaned metadata objects. For complete sanitization, also clear document info fields before saving.' },
      { q: 'Is visual verification sufficient?', a: 'Never. Always test with text extraction tools. Visual masking looks identical to true redaction in viewers.' },
    ]
  },

  '/guides/federal-court-exhibit-stamping-formatting-rules': {
    title: 'Federal Court Exhibit Stamping & Formatting Rules',
    hero: 'Federal courts impose specific formatting requirements for trial exhibits. Non-compliant exhibits risk exclusion, delays, or sanctions. This guide covers FRCP requirements, local rule variations, and practical formatting standards.',
    markdown: `# Federal Court Exhibit Stamping & Formatting Rules

Federal courts impose specific formatting requirements for trial exhibits. Non-compliant exhibits risk exclusion, delays, or sanctions. This guide covers FRCP requirements, local rule variations, and practical formatting standards.

## Federal Rules of Civil Procedure Baseline

FRCP Rule 34(b)(2)(E) governs production format: "A party must produce documents as they are kept in the usual course of business or must organize and label them to correspond to the categories in the request."

For trial exhibits specifically, FRCP Rule 43 and local rules control. Key principles:
- **Unique identification**: Every exhibit page uniquely numbered
- **Sequential integrity**: No gaps, no duplicates
- **Legibility**: Stamps readable at 100% zoom and in print
- **Non-interference**: Stamps must not obscure document content

## Major District Court Local Rules

### Southern District of New York (SDNY)
- Local Rule 26.2: Exhibits numbered sequentially with party prefix
- Format: P-0001 (Plaintiff), D-0001 (Defendant)
- Font: Times New Roman, 10pt minimum
- Position: Bottom right, 0.5" margin

### Northern District of California (NDCA)
- Civil Local Rule 3-5: "All exhibits shall be pre-marked"
- Electronic exhibits: Bates in metadata acceptable
- Physical: Bottom right, Helvetica 9pt
- Joint exhibit list required 14 days before trial

### Eastern District of Texas (EDTX)
- Local Rule CV-26: Mandatory Bates on all productions
- 6-digit minimum, prefix identifying case
- Top right for exhibits, bottom right for productions
- Courier New 11pt preferred

### Delaware District (D. Del.)
- Standing Order: Exhibits pre-marked with case number
- Format: CIV-22-00123-EXH-0001
- Chancery Court: Top right, Times Roman 11pt
- No handwritten corrections on stamps

### Central District of California (CDCA)
- Local Rule 16-15: Exhibit numbering conference required
- Joint numbering encouraged
- Format: JOINT-001, PLAINTIFF-001, DEFENDANT-001

## Font and Typography Standards
| Court | Font | Size | Style |
|---|---|---|---|
| Most Federal | Times New Roman / Times Roman | 10-11pt | Regular |
| ED TX | Courier New | 11pt | Regular |
| ND CA | Helvetica / Arial | 9-10pt | Regular |
| D. Del. | Times Roman | 11pt | Regular |
| Bankruptcy | Court-specific | 10pt | Regular |

**Critical**: Never use bold, italic, or decorative fonts. Serif fonts (Times) preferred for print readability. Monospace (Courier) for alignment in high-volume productions.

## Positioning and Margin Rules
**Standard Margins**
- Minimum: 0.5" (36pt) from page edge
- Recommended: 0.75" (54pt) for binder clips
- Binding edge: Additional 0.25" clearance

**Position by Document Type**
- Trial Exhibits: Top right (FRCP preference)
- Discovery Productions: Bottom right
- Deposition Exhibits: Bottom right
- Appellate Record: Bottom center (per FRAP)

**Landscape Pages**
- Stamp rotates with page orientation
- "Bottom right" becomes "bottom right in landscape"
- Verify manually — auto-rotation varies by tool

## Prefix Conventions by Circuit
**2nd Circuit (NY, CT, VT)**: Party initials + sequential (P-001, D-001)
**9th Circuit (CA, WA, OR, AZ, NV, ID, MT, AK, HI, GU)**: Case number + EXH (2:22-cv-01234-EXH-001)
**5th Circuit (TX, LA, MS)**: Simple sequential with case prefix (SMITH-0001)
**Federal Circuit**: Patent-specific: PAT-0001, PRIOR-ART-0001
**D.C. Circuit**: Agency-specific: EPA-001, SEC-001

**Joint Exhibits**: JOINT-001 or JX-001 (universally accepted)

## Electronic Exhibit Considerations
**E-Filing (CM/ECF)**
- PDF/A-1b or PDF/A-2b preferred
- Embedded Bates in metadata (PDF Title field)
- Bookmarks matching exhibit list
- OCR text layer required

**Trial Presentation Software**
- TrialDirector, Sanction, OnCue compatible
- High-resolution stamps (300 DPI minimum)
- Color stamps acceptable (blue for plaintiff, red for defendant) but B&W required for record

**Remote/Hybrid Trials**
- Pre-loaded exhibit packages
- Real-time stamp verification
- Backup physical copies stamped identically`,
    faq: [
      { q: 'Can I use different fonts for different exhibit types?', a: 'No. Consistency is required. Choose one font for the entire case.' },
      { q: 'What if the stamp overlaps text?', a: 'Adjust margin or position. Courts reject exhibits where stamps obscure content.' },
      { q: 'Are colored stamps acceptable?', a: 'For trial presentation, yes. For the official record, black only.' },
      { q: 'Do I need to stamp every page of a multi-page exhibit?', a: 'Yes. Every page receives a unique sequential number.' },
    ]
  },

  '/guides/hipaa-and-pii-redaction-checklist-for-paralegals': {
    title: 'HIPAA & PII Redaction Checklist for Paralegals',
    hero: 'HIPAA Safe Harbor de-identification requires removing 18 specific PHI identifiers. This checklist provides a step-by-step workflow for paralegals to ensure complete, defensible redaction of medical records and PII-containing documents.',
    markdown: `# HIPAA & PII Redaction Checklist for Paralegals

HIPAA Safe Harbor de-identification requires removing 18 specific PHI identifiers. This checklist provides a step-by-step workflow for paralegals to ensure complete, defensible redaction of medical records and PII-containing documents.

## The 18 HIPAA Safe Harbor Identifiers

HIPAA §164.514(b)(2) lists 18 identifiers that must be removed for Safe Harbor de-identification:

1. **Names** (patient, relatives, providers, employers)
2. **Geographic subdivisions** smaller than state (street, city, county, ZIP)
3. **Dates** directly related to individual (birth, admission, discharge, death)
4. **Telephone numbers**
5. **Fax numbers**
6. **Email addresses**
7. **Social Security Numbers**
8. **Medical Record Numbers (MRN)**
9. **Health plan beneficiary numbers**
10. **Account numbers**
11. **Certificate/license numbers**
12. **Vehicle identifiers** (VIN, license plate)
13. **Device identifiers** (serial numbers)
14. **Web URLs**
15. **IP addresses**
16. **Biometric identifiers** (fingerprints, voice prints)
17. **Full-face photographs** and comparable images
18. **Any other unique identifying number, characteristic, or code**

**Critical**: The 18th category is a catch-all. Any data point that could identify the individual in context must go.

## Pre-Redaction Workflow

### Step 1: Document Inventory
- List all documents by type (chart, billing, imaging, correspondence)
- Identify source system (EHR, billing, imaging, paper scan)
- Note OCR status (searchable text vs. image-only)

### Step 2: Risk Assessment
- High risk: Narrative notes, discharge summaries, correspondence
- Medium risk: Structured data (labs, vitals, medication lists)
- Low risk: De-identified research datasets (verify!)

### Step 3: Tool Selection
- Image-only PDFs → OCR first, then redact
- Searchable PDFs → Direct text redaction
- Mixed → Process in batches by type
- Validate tool uses \`apply_redactions(images=PDF_REDACT_IMAGE_PIXELS)\`

### Step 4: Keyword List Construction
Build a case-specific keyword list including:
- Patient name variations (last, first, middle, maiden, nicknames)
- Provider names (attending, consulting, facility)
- MRN formats (with/without prefixes, check digits)
- Date formats (MM/DD/YYYY, DD-MON-YY, YYYYMMDD)
- Insurance/policy numbers
- Facility-specific codes

## Redaction Execution Checklist

### Automated Pass 1: Regex Patterns
- \`SSN: \\b\\d{3}-\\d{2}-\\d{4}\\b\`
- \`12-digit IDs: \\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\b\`
- \`Email: \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b\`
- \`Phone: \\b\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}\\b\`
- Dates (multiple formats)

### Automated Pass 2: Keyword Search
- Patient name (all variations)
- MRN / Account numbers
- Provider names (individuals and facilities)
- Insurance identifiers
- Facility-specific codes

### Manual Pass 3: Visual Inspection
- Narrative clinical notes (physician notes, H&P, consults)
- Discharge summaries
- Correspondence/referral letters
- Imaging reports (often contain names in headers)
- Billing detail (procedure descriptions may include diagnosis)
- Face sheets / demographics pages

### Visual Box Redaction for:
- Entire header/footer regions with demographics
- Signature blocks
- Photograph areas
- Barcode/QR code regions

## Quality Assurance Protocol

### Automated Validation
\`\`\`bash
# Extract text from redacted PDF
pdftotext redacted.pdf - | grep -i "redacted_term"
# Should return zero matches

# Verify file size reduction
ls -la original.pdf redacted.pdf
# Redacted should be smaller (content removed)
\`\`\`

### Manual Spot-Check (minimum 10% of pages)
1. Open in PDF viewer, attempt text selection on redacted areas
2. Search for known PHI terms (Ctrl+F)
3. Verify "REDACTED" overlay visible
4. Check no ghosting/artifacts from original text

### Edge Case Review
- Handwritten annotations (OCR may miss)
- Embedded images with text (lab result photos)
- Watermarks/letterheads with facility names
- Metadata fields (Author, Title, Subject, Keywords)
- Form fields (even hidden)
- Annotations/comments

## Documentation and Audit Trail

Maintain a redaction log for each production:
- **Date/Time** of redaction
- **Tool version** used (e.g., "Legal PDF Tools v1.0, PyMuPDF 1.24.9")
- **Operator** name/ID
- **Source document** Bates range
- **Output document** Bates range
- **Patterns applied** (regex list, keyword list)
- **Pages manually reviewed**
- **Exceptions/notes** (items that couldn't be redacted, why)
- **QA reviewer** sign-off
- **Hash verification** (SHA-256 of output for integrity)

**Retention**: Keep redaction logs for the duration of the matter plus 6 years, or per your firm's record retention policy.`,
    faq: [
      { q: 'Does removing the 18 identifiers guarantee Safe Harbor?', a: 'Safe Harbor also requires "no actual knowledge" that remaining information could identify the individual. Rare diseases, small populations, or unique combinations may require additional redaction beyond the 18.' },
      { q: 'How do I redact dates without removing all dates?', a: "HIPAA requires removing dates 'directly related to the individual.' General dates (study period, publication date) may remain. Use context-aware review for clinical dates." },
      { q: 'What about ZIP codes?', a: 'First 3 digits of ZIP may remain if the geographic unit contains >20,000 people. Otherwise, remove all 5 digits. Our tool removes full ZIP by default — adjust for your population.' },
      { q: 'Can I use this for 42 CFR Part 2 (substance use) records?', a: 'Part 2 has stricter requirements. Consult counsel. This tool assists with technical redaction but Part 2 may require additional safeguards.' },
    ]
  },
}

export default function GuideArticle({ slug }) {
  const [guide, setGuide] = useState(null)

  useEffect(() => {
    const content = guideContent[slug]
    if (content) {
      setGuide({ ...content, slug })
    }
  }, [slug])

  if (!guide) {
    return (
      <>
        <Helmet>
          <title>Guide Not Found — Legal PDF Tools</title>
          <meta name="description" content="The requested guide could not be found." />
        </Helmet>
        <div className="px-4 py-16 text-center">
          <h1 className="section-heading">Guide Not Found</h1>
          <p className="section-subheading mt-4">The requested guide could not be found.</p>
        </div>
      </>
    )
  }

  const pageConfig = guidePages[slug] || {}

  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!guide.markdown) return []
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const headings = []
    let match
    while ((match = headingRegex.exec(guide.markdown)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        id: match[2].trim().toLowerCase().replace(/[^\w]+/g, '-')
      })
    }
    return headings
  }, [guide.markdown])

  const renderMarkdown = () => (
    <div className="prose prose-neutral max-w-none space-y-8">
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {guide.markdown}
      </ReactMarkdown>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{guide.title}</title>
        <meta name="description" content={pageConfig.description || guide.hero} />
        <link rel="canonical" href={pageConfig.canonical} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={pageConfig.description || guide.hero} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.hero,
          url: pageConfig.canonical,
          datePublished: '2026-11-18',
          dateModified: '2026-11-18',
          author: { '@type': 'Organization', name: 'Legal PDF Tools' },
          publisher: { '@type': 'Organization', name: 'Legal PDF Tools', logo: { '@type': 'ImageObject', url: 'https://legalbates.vercel.app/logo.png' } },
        })}</script>
      </Helmet>

      <article className="px-4 py-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-700">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/guides" className="hover:text-primary-700">Guides</Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-900 font-medium" aria-current="page">{guide.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {slug.includes('bates') && <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">Bates Numbering</span>}
              {slug.includes('redact') && <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Redaction</span>}
              {slug.includes('court') && <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Court Rules</span>}
              {slug.includes('hipaa') && <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">HIPAA/Compliance</span>}
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {guide.markdown && guide.markdown.split(' ').length > 2000 ? '15 min read' : '12 min read'}
              </span>
            </div>
            <h1 className="section-heading text-balance">{guide.title}</h1>
            <p className="section-subheading mt-4 content-text">{guide.hero}</p>
          </header>

          {/* Table of Contents - Fixed positioning */}
          <aside className="hidden lg:block sticky top-24 mb-12" aria-label="Table of contents">
            <div className="card w-full max-w-xs">
              <h3 className="font-semibold text-neutral-900 mb-4">Table of Contents</h3>
              <nav>
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li key={index}>
                      <a
                        href={`#${heading.id}`}
                        className={`text-sm transition-colors ${heading.level === 3 ? 'ml-4 text-neutral-600' : 'font-medium text-neutral-700'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const el = document.getElementById(heading.id)
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#faq"
                      className="text-sm text-neutral-700 hover:text-primary-700 transition-colors"
                    >
                      Frequently Asked Questions
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:max-w-2xl">
            {/* Header */}
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {slug.includes('bates') && <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">Bates Numbering</span>}
                {slug.includes('redact') && <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Redaction</span>}
                {slug.includes('court') && <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Court Rules</span>}
                {slug.includes('hipaa') && <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">HIPAA/Compliance</span>}
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {guide.markdown && guide.markdown.split(' ').length > 2000 ? '15 min read' : '12 min read'}
                </span>
              </div>
              <h1 className="section-heading text-balance">{guide.title}</h1>
              <p className="section-subheading mt-4 content-text">{guide.hero}</p>
            </header>

            {/* Main Content */}
            <div className="lg:max-w-2xl">
              {renderMarkdown()}

              {/* FAQ Section */}
              <section id="faq" className="pt-8 border-t border-neutral-200 animate-fade-in">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  Frequently Asked Questions
                </h2>
                <dl className="space-y-6">
                  {guide.faq.map((item, index) => (
                    <div key={index} className="faq-item">
                      <dt className="font-medium text-neutral-900 mb-2">{item.q}</dt>
                      <dd className="content-text text-neutral-700">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            {/* CTA */}
            <section className="mt-16 pt-12 border-t border-neutral-200">
              <div className="card bg-primary-50 border-primary-100">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">Apply This Knowledge</h2>
                  <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
                    Use our free, professional-grade tools to implement these best practices. Zero server retention, no signup required.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to="/" className="btn-primary">
                      <Scale className="h-5 w-5" aria-hidden="true" />
                      Open Bates & Redaction Tool
                    </Link>
                    <Link to="/guides" className="btn-secondary">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back to Guides
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Ad Slot */}
            <AdSlot slotName="guide-article" />
          </div>
        </div>
      </article>
    </>
  )
}