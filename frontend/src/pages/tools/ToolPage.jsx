import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Layout, PDFTool } from '../../components'
import { seoPages } from '../../config/seoPages'
import {
  Scale, Shield, FileText, Lock, Brain, FileSearch, Users, ChevronLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Workflow-specific content and structured data
const workflowDetails = {
  'bates-stamp-court-exhibits': {
    icon: Scale,
    tagline: 'Court-compliant exhibit numbering for federal & state courts',
    features: [
      'EXHIBIT-A- prefix matching federal court conventions',
      'Top-right positioning per FRCP and most local rules',
      'Times-Roman 11pt for professional court binder appearance',
      '4-digit zero-padding (0001-9999 exhibits)',
      '36pt margin from page edge for binder clips',
      'Batch process entire exhibit sets at once',
      'Preview stamp placement before processing',
      'Zero server retention — exhibits never leave your device',
    ],
    useCases: [
      'Trial exhibit preparation for federal and state courts',
      'Deposition exhibit numbering',
      'Arbitration hearing document organization',
      'Mediation brief exhibit management',
      'Appellate record preparation',
    ],
    faq: [
      {
        q: 'Does this meet federal court exhibit formatting requirements?',
        a: 'The EXHIBIT-A- prefix with top-right placement follows the majority of federal district court local rules. Always confirm your specific jurisdiction\'s requirements.',
      },
      {
        q: 'Can I use different prefixes for plaintiff vs defendant exhibits?',
        a: 'Yes. Process plaintiff exhibits with EXHIBIT-P- and defendant exhibits with EXHIBIT-D- in separate batches.',
      },
      {
        q: 'What if I need to add exhibits mid-trial?',
        a: 'Simply set the start number to continue from your last exhibit number. The tool maintains sequential integrity.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Court Exhibit Bates Numbering Tool',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Bates stamp court exhibits with EXHIBIT-A- prefix, top-right positioning, and court-compliant formatting. Free, no signup, zero retention.',
      featureList: [
        'EXHIBIT-A- prefix matching federal court conventions',
        'Top-right positioning per FRCP and most local rules',
        'Times-Roman 11pt for professional court binder appearance',
        '4-digit zero-padding (0001-9999 exhibits)',
        '36pt margin from page edge for binder clips',
        'Batch process entire exhibit sets at once',
        'Preview stamp placement before processing',
        'Zero server retention — exhibits never leave your device',
      ],
    },
  },
  'redact-ssn-from-pdf': {
    icon: Shield,
    tagline: 'Auto-detect & permanently redact SSNs, emails, and 12-digit IDs',
    features: [
      'Automatic SSN detection (XXX-XX-XXXX pattern)',
      '12-digit ID/Aadhaar number detection',
      'Email address detection and redaction',
      'True permanent redaction — text layer destroyed',
      'Visual "REDACTED" overlay on each redaction',
      'HIPAA-compliant for medical records',
      'GLBA-compliant for financial documents',
      'Zero server retention — client-side processing',
    ],
    useCases: [
      'Medical record production for litigation',
      'Financial document disclosure',
      'Employment file redaction',
      'Settlement agreement privacy protection',
      'Public records request fulfillment',
      'Client intake document sanitization',
    ],
    faq: [
      {
        q: 'Can redacted text be recovered with OCR or text extraction?',
        a: 'No. PDF_REDACT_IMAGE_PIXELS replaces the text region with actual image pixels. The original text layer is deleted from the PDF structure entirely.',
      },
      {
        q: 'Does this work on scanned PDFs?',
        a: 'For scanned documents, run OCR first, then use this tool. The regex patterns require selectable text layer.',
      },
      {
        q: 'What if the SSN format varies (no dashes, spaces)?',
        a: 'The current pattern matches XXX-XX-XXXX. For other formats, use the keyword redaction feature with custom patterns.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Permanently Redact SSN & PII from PDFs',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Automatically detect and permanently redact Social Security Numbers, email addresses, and 12-digit IDs from PDFs. True text-layer destruction. Zero server retention. Free.',
      featureList: [
        'Automatic SSN detection (XXX-XX-XXXX pattern)',
        '12-digit ID/Aadhaar number detection',
        'Email address detection and redaction',
        'True permanent redaction — text layer destroyed',
        'Visual "REDACTED" overlay on each redaction',
        'HIPAA-compliant for medical records',
        'GLBA-compliant for financial documents',
        'Zero server retention — client-side processing',
      ],
    },
  },
  'bates-number-discovery-documents': {
    icon: FileSearch,
    tagline: 'High-volume discovery productions with PROD- prefix & 7-digit padding',
    features: [
      'PROD- prefix standard for discovery productions',
      '7-digit zero-padding for 10M+ page capacity',
      'Bottom-right positioning per production protocols',
      'Helvetica 9pt for dense document compatibility',
      '18pt tight margin for maximum page content',
      'Batch process thousands of PDFs efficiently',
      'Continuation numbering across productions',
      'Zero server retention — confidential docs stay local',
    ],
    useCases: [
      'Federal Rules of Civil Procedure Rule 34 productions',
      'SEC and regulatory document submissions',
      'M&A due diligence document rooms',
      'Patent litigation document productions',
      'Class action discovery responses',
      'Internal investigation document collections',
    ],
    faq: [
      {
        q: 'Can I continue numbering from a previous production?',
        a: 'Yes. Set start_num to the next sequential number (e.g., if last production ended at PROD-0045231, start at 45232).',
      },
      {
        q: 'How do I handle productions with mixed page orientations?',
        a: 'The tool stamps each page in its native orientation. For landscape pages, the bottom-right position adjusts automatically.',
      },
      {
        q: 'Is there a limit on batch size?',
        a: 'The web interface handles ~50MB per upload. For larger productions, process in multiple batches with sequential numbering.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Legal Discovery Production Bates Stamper',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Bates stamp discovery productions with PROD- prefix and 7-digit zero-padding. Handles high-volume document productions. Free, no limits, zero retention.',
      featureList: [
        'PROD- prefix standard for discovery productions',
        '7-digit zero-padding for 10M+ page capacity',
        'Bottom-right positioning per production protocols',
        'Helvetica 9pt for dense document compatibility',
        '18pt tight margin for maximum page content',
        'Batch process thousands of PDFs efficiently',
        'Continuation numbering across productions',
        'Zero server retention — confidential docs stay local',
      ],
    },
  },
  'confidential-stamp-pdf': {
    icon: Lock,
    tagline: 'CONFIDENTIAL, PRIVILEGED, or custom protective markings',
    features: [
      'CONFIDENTIAL- prefix for protective order compliance',
      'Bottom-center positioning — maximum visibility',
      'Courier 14pt monospace for consistent alignment',
      '48pt margin clears binding and hole punches',
      'Customizable for PRIVILEGED, ATTORNEYS EYES ONLY',
      'Sequential numbering for audit trail',
      'Batch apply to entire document productions',
      'Zero server retention — privileged docs stay local',
    ],
    useCases: [
      'Protective order document marking',
      'Attorney-client privilege designation',
      'Work product doctrine marking',
      'Trade secret protective order compliance',
      'Confidential settlement agreement stamping',
      'Expert report confidentiality marking',
    ],
    faq: [
      {
        q: 'Can I use custom protective order language?',
        a: 'Yes. Change the prefix to match your protective order\'s exact required language (e.g., HIGHLY CONFIDENTIAL-, ATTORNEYS EYES ONLY-).',
      },
      {
        q: 'Does this satisfy FRCP 26(c) protective order requirements?',
        a: 'Conspicuous page-by-page marking is a standard requirement. This tool provides that. Consult your protective order for specific font/position mandates.',
      },
      {
        q: 'Can I stamp only specific pages?',
        a: 'Currently the tool stamps all pages. For selective stamping, split the PDF first, stamp the relevant sections, then recombine.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Add Confidential & Privilege Stamps to PDF',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Stamp PDFs with CONFIDENTIAL, PRIVILEGED, or custom protective markings. Bottom-center positioning for maximum visibility. Free, no signup, zero retention.',
      featureList: [
        'CONFIDENTIAL- prefix for protective order compliance',
        'Bottom-center positioning — maximum visibility',
        'Courier 14pt monospace for consistent alignment',
        '48pt margin clears binding and hole punches',
        'Customizable for PRIVILEGED, ATTORNEYS EYES ONLY',
        'Sequential numbering for audit trail',
        'Batch apply to entire document productions',
        'Zero server retention — privileged docs stay local',
      ],
    },
  },
  'redact-bank-account-numbers-pdf': {
    icon: FileText,
    tagline: 'Account, routing, SWIFT, IBAN, credit card keywords + visual box redaction',
    features: [
      'Pre-configured financial keyword list (account, routing, ABA, SWIFT, IBAN, card numbers)',
      'Visual box redaction for tabular financial data',
      'Permanent text-layer destruction',
      'GLBA-compliant for consumer financial records',
      'PCI-DSS aligned for payment card data',
      'Custom keyword addition for institution-specific terms',
      'Batch process monthly statements',
      'Zero server retention — financial data never leaves device',
    ],
    useCases: [
      'Bank statement production in litigation',
      'Financial disclosure redaction',
      'Bankruptcy document preparation',
      'Divorce financial affidavit sanitization',
      'Regulatory examination response',
      'M&A due diligence financial scrubbing',
    ],
    faq: [
      {
        q: 'Does this detect credit card numbers automatically?',
        a: 'The keyword redaction catches "credit card" and "debit card" labels. For actual 16-digit card numbers, use visual box redaction on the column or add a custom regex via the API.',
      },
      {
        q: 'Can I redact entire columns in financial tables?',
        a: 'Yes. Use visual box redaction with percentage coordinates to mask full columns across all pages.',
      },
      {
        q: 'Is this sufficient for PCI-DSS compliance?',
        a: 'Permanent redaction of PAN data meets PCI-DSS rendering requirements. However, full compliance requires additional controls — consult your QSA.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Scrub Bank Account Numbers & Financial Data from PDFs',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Permanently redact bank account numbers, routing numbers, credit card numbers, and financial identifiers from PDFs. GLBA/PCI-DSS compliant. Free, zero retention.',
      featureList: [
        'Pre-configured financial keyword list (account, routing, ABA, SWIFT, IBAN, card numbers)',
        'Visual box redaction for tabular financial data',
        'Permanent text-layer destruction',
        'GLBA-compliant for consumer financial records',
        'PCI-DSS aligned for payment card data',
        'Custom keyword addition for institution-specific terms',
        'Batch process monthly statements',
        'Zero server retention — financial data never leaves device',
      ],
    },
  },
  'medical-records-hipaa-pdf-redaction': {
    icon: Brain,
    tagline: 'HIPAA Safe Harbor — 18 PHI identifiers + auto PII detection',
    features: [
      'HIPAA Safe Harbor 18-identifier keyword preset',
      'Automatic SSN, MRN, email detection via regex',
      'Provider identifier redaction (NPI, DEA, license numbers)',
      'Medical coding system redaction (ICD-10, CPT, HCPCS)',
      'Permanent text-layer destruction — not visual masking',
      'Visual box redaction for narrative clinical notes',
      'Bates numbering option for production tracking (MED- prefix)',
      'Zero server retention — PHI never leaves your device',
    ],
    useCases: [
      'Litigation medical record production',
      'Research dataset de-identification',
      'Public health reporting compliance',
      'Insurance claim document sanitization',
      'Expert witness record preparation',
      'Medical malpractice document review',
    ],
    faq: [
      {
        q: 'Does this achieve HIPAA Safe Harbor de-identification?',
        a: 'The tool removes the 18 Safe Harbor identifiers. However, Safe Harbor also requires "no actual knowledge" that remaining info could identify individuals. Review context-specific identifiers (rare conditions, small populations) manually.',
      },
      {
        q: 'Can I redact handwritten clinical notes?',
        a: 'Only if OCR has created a text layer. For scanned handwriting, run OCR first, then use visual box redaction for entire note sections.',
      },
      {
        q: 'What about ZIP codes?',
        a: 'First 3 digits of ZIP may remain if the geographic unit contains >20,000 people. Otherwise, remove all 5 digits. Our tool removes full ZIP by default — adjust for your population.',
      },
      {
        q: 'Can I use this for 42 CFR Part 2 (substance use) records?',
        a: 'Part 2 has stricter requirements. Consult counsel. This tool assists with technical redaction but Part 2 may require additional safeguards.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'HIPAA-Compliant Medical Record Redaction Tool',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Permanently redact Protected Health Information (PHI) from medical records. Auto-detects MRNs, DOBs, SSNs, provider names. HIPAA Safe Harbor compliant. Free, zero retention.',
      featureList: [
        'HIPAA Safe Harbor 18-identifier keyword preset',
        'Automatic SSN, MRN, email detection via regex',
        'Provider identifier redaction (NPI, DEA, license numbers)',
        'Medical coding system redaction (ICD-10, CPT, HCPCS)',
        'Permanent text-layer destruction — not visual masking',
        'Visual box redaction for narrative clinical notes',
        'Bates numbering option for production tracking (MED- prefix)',
        'Zero server retention — PHI never leaves your device',
      ],
    },
  },
  'law-firm-pdf-exhibit-generator': {
    icon: Users,
    tagline: 'Case prefixes, continuation numbering, batch export, CSV manifests',
    features: [
      'Case-specific prefix conventions (e.g., SJ-, PVT-, CIV-)',
      '5-digit zero-padding for up to 99,999 exhibits',
      'Continuation numbering across supplement productions',
      'Batch upload and processing for efficiency',
      'Exhibit manifest CSV export (number, filename, pages)',
      'Preview stamp placement on first page of each exhibit',
      'Keyboard shortcuts for high-volume workflows',
      'Zero server retention — client confidential docs stay local',
    ],
    useCases: [
      'Trial exhibit preparation for associates and partners',
      'Supplemental production numbering',
      'Deposition exhibit organization',
      'Arbitration hearing binder preparation',
      'Mediation exhibit management',
      'Appellate record exhibit numbering',
    ],
    faq: [
      {
        q: 'Can I save case prefixes for reuse?',
        a: 'Prefixes are stored in browser localStorage for session persistence. No server storage — your case data stays on your device.',
      },
      {
        q: 'Does the tool generate exhibit lists/tables of contents?',
        a: 'Yes. The manifest CSV export includes exhibit number, original filename, page count, and date processed — ready for binder indices.',
      },
      {
        q: 'Can I process exhibits with different prefixes in one batch?',
        a: 'Process each prefix group separately, then combine. The tool maintains sequential integrity within each prefix.',
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Paralegal Batch Exhibit Numbering Utility',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      description: 'Batch Bates stamp exhibits for trial binders. Custom prefixes per case, continuation numbering, batch processing. Built for paralegal workflows. Free, no limits.',
      featureList: [
        'Case-specific prefix conventions (e.g., SJ-, PVT-, CIV-)',
        '5-digit zero-padding for up to 99,999 exhibits',
        'Continuation numbering across supplement productions',
        'Batch upload and processing for efficiency',
        'Exhibit manifest CSV export (number, filename, pages)',
        'Preview stamp placement on first page of each exhibit',
        'Keyboard shortcuts for high-volume workflows',
        'Zero server retention — client confidential docs stay local',
      ],
    },
  },
}

export default function ToolPage({ slug }) {
  const workflow = workflowDetails[slug]
  const baseConfig = seoPages[`/${slug}`]
  const canonical = `https://legalpdftools.com/${slug}`

  if (!workflow) {
    return (
      <Layout pageConfig={{ title: 'Tool Not Found', description: 'The requested tool could not be found.' }}>
        <div className="px-4 py-16 text-center">
          <h1 className="section-heading">Tool Not Found</h1>
          <p className="section-subheading mt-4">The requested tool could not be found.</p>
        </div>
      </Layout>
    )
  }

  const pageConfig = {
    title: seoPages[`/${slug}`]?.title || workflow.tagline,
    description: seoPages[`/${slug}`]?.description || workflow.tagline,
    canonical,
  }

  const jsonLd = useMemo(() => ({
    ...workflow.schema,
    url: canonical,
  }), [slug])

  const renderMarkdown = () => (
    <div className="prose prose-neutral max-w-none space-y-8">
      <div dangerouslySetInnerHTML={{ __html: seoPages[`/${slug}`]?.content?.intro || '' }} />
      <div dangerouslySetInnerHTML={{ __html: seoPages[`/${slug}`]?.content?.workflow || '' }} />
      <div dangerouslySetInnerHTML={{ __html: seoPages[`/${slug}`]?.content?.features?.join('<br>') || '' }} />
      <div dangerouslySetInnerHTML={{ __html: seoPages[`/${slug}`]?.content?.useCases?.join('<br>') || '' }} />
      <div dangerouslySetInnerHTML={{ __html: seoPages[`/${slug}`]?.content?.faq?.map(f => `<dt>${f.q}</dt><dd>${f.a}</dd>`).join('') || '' }} />
    </div>
  )

  return (
    <Layout pageConfig={pageConfig}>
      <Helmet>
        <title>{seoPages[`/${slug}`]?.title || workflow.tagline}</title>
        <meta name="description" content={seoPages[`/${slug}`]?.description || workflow.tagline} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seoPages[`/${slug}`]?.title || workflow.tagline} />
        <meta property="og:description" content={seoPages[`/${slug}`]?.description || workflow.tagline} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoPages[`/${slug}`]?.title || workflow.tagline} />
        <meta name="twitter:description" content={seoPages[`/${slug}`]?.description || workflow.tagline} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="px-4 py-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-700">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/tools" className="hover:text-primary-700">Tools</Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-900 font-medium" aria-current="page">{seoPages[`/${slug}`]?.title || workflow.tagline}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                {slug.includes('bates') && 'Bates Numbering'}
                {slug.includes('redact') && 'Redaction'}
                {slug.includes('court') && 'Court Rules'}
                {slug.includes('hipaa') && 'HIPAA/Compliance'}
                {slug.includes('bank') && 'Financial'}
                {slug.includes('confidential') && 'Document Security'}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <span className="h-3 w-3" aria-hidden="true">⏱</span>
                2 min read
              </span>
            </div>
            <h1 className="section-heading text-balance">{seoPages[`/${slug}`]?.title || workflow.tagline}</h1>
            <p className="section-subheading mt-4 content-text">{workflow.tagline}</p>
          </header>

          {/* Table of Contents */}
          <nav className="card mb-12 sticky top-24 hidden lg:block" aria-label="Table of contents">
            <h3 className="font-semibold text-neutral-900 mb-4">Table of Contents</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-neutral-700 hover:text-primary-700 transition-colors">Key Features</a></li>
              <li><a href="#use-cases" className="text-sm text-neutral-700 hover:text-primary-700 transition-colors">Use Cases</a></li>
              <li><a href="#faq" className="text-sm text-neutral-700 hover:text-primary-700 transition-colors">FAQ</a></li>
            </ul>
          </nav>

          {/* Content */}
          <div className="prose prose-neutral max-w-none space-y-12">
            <section id="features" className="animate-fade-in">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-mono text-sm">1</span>
                Key Features
              </h2>
              <ul className="feature-list">
                {workflow.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <span className="text-primary-700">✓</span>
                    <span className="content-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="use-cases" className="animate-fade-in">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-mono text-sm">2</span>
                Common Use Cases
              </h2>
              <ul className="feature-list">
                {workflow.useCases.map((useCase, i) => (
                  <li key={i} className="feature-item">
                    <span className="text-primary-700">→</span>
                    <span className="content-text">{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="faq" className="pt-8 border-t border-neutral-200 animate-fade-in">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Frequently Asked Questions
              </h2>
              <dl className="space-y-6">
                {workflow.faq.map((item, index) => (
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
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Ready to Get Started?</h2>
                <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
                  Use our free, professional-grade tools instantly. No signup, zero server retention, instant processing.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/" className="btn-primary">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                    Open Tool Now
                  </Link>
                  <Link to="/tools" className="btn-secondary">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    View All Tools
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Slot */}
          <AdSlot slotName="tool-page" />
        </div>
      </article>
    </Layout>
  )
}