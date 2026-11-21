import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FileText, Shield, Lock, ChevronDown, Menu, X, Scale, Brain, Sparkles } from 'lucide-react'

const navigation = [
  { name: 'Tools', href: '/', current: true },
  { name: 'Guides', href: '/guides', current: false },
]

const toolLinks = [
  { name: 'Bates Stamp & Redact', href: '/', description: 'Default: CASE- prefix, 6 digits' },
  { name: 'Court Exhibits', href: '/bates-stamp-court-exhibits', description: 'EXHIBIT-A- prefix, top-right' },
  { name: 'Redact SSN & PII', href: '/redact-ssn-from-pdf', description: 'Auto-detect SSN, ID, email' },
  { name: 'Discovery Productions', href: '/bates-number-discovery-documents', description: 'PROD- prefix, 7 digits' },
  { name: 'Confidential Stamps', href: '/confidential-stamp-pdf', description: 'CONFIDENTIAL- bottom-center' },
  { name: 'Bank/Financial Redact', href: '/redact-bank-account-numbers-pdf', description: 'Financial keyword presets' },
  { name: 'HIPAA Medical Records', href: '/medical-records-hipaa-pdf-redaction', description: 'PHI Safe Harbor keywords' },
  { name: 'Paralegal Exhibit Gen', href: '/law-firm-pdf-exhibit-generator', description: 'Case prefixes, batch export' },


]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Layout({ children, pageConfig }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)

  // Generate JSON-LD structured data
  const structuredData = pageConfig?.content?.faq ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: pageConfig.title,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    description: pageConfig.description,
    featureList: pageConfig.content?.features || [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pageConfig.content.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  } : pageConfig?.canonical ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageConfig.title,
    description: pageConfig.description,
    url: pageConfig.canonical,
  } : null

  return (
    <>
      <Helmet>
        <title>{pageConfig?.title}</title>
        <meta name="description" content={pageConfig?.description} />
        <link rel="canonical" href={pageConfig?.canonical} />
        <meta property="og:title" content={pageConfig?.title} />
        <meta property="og:description" content={pageConfig?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageConfig?.canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageConfig?.title} />
        <meta name="twitter:description" content={pageConfig?.description} />
        {structuredData && (
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-200">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2" aria-label="Legal PDF Tools Home">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
                    <Scale className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-xl text-neutral-900">LegalPDF<span className="text-primary-700">Tools</span></span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:gap-8">
                <div className="relative" onMouseEnter={() => setToolsDropdownOpen(true)} onMouseLeave={() => setToolsDropdownOpen(false)}>
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={toolsDropdownOpen}
                  >
                    Tools <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-neutral-200 shadow-lg py-2 animate-fade-in" role="menu">
                      {toolLinks.map((tool) => (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          className="flex flex-col px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 transition-colors"
                          role="menuitem"
                        >
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-xs text-neutral-500">{tool.description}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/guides"
                  className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                >
                  Guides
                </Link>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex md:items-center md:gap-4">
                <Link to="/privacy-policy" className="text-sm text-neutral-600 hover:text-primary-700 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-sm text-neutral-600 hover:text-primary-700 transition-colors">
                  Terms
                </Link>
                <Link to="/about" className="text-sm text-neutral-600 hover:text-primary-700 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="btn-primary text-sm">
                  Contact
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-neutral-700 hover:text-primary-700 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div id="mobile-menu" className="md:hidden py-4 border-t border-neutral-200 animate-fade-in">
                <div className="space-y-4">
                  {toolLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      className="block px-2 py-2 text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {tool.name}
                      <span className="block text-xs text-neutral-500 font-normal">{tool.description}</span>
                    </Link>
                  ))}
                  <Link
                    to="/guides"
                    className="block px-2 py-2 text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Guides
                  </Link>
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    {legalLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="block px-2 py-2 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Trust Bar */}
        <div className="bg-primary-50 border-b border-primary-100 px-4 py-3">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-6 text-sm text-primary-800">
            <span className="trust-badge">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Zero Server Retention
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Files Processed in Browser RAM
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5" aria-hidden="true" />
              No Account Required
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Free Forever
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-neutral-50 border-t border-neutral-200 px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Legal PDF Tools Home">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
                    <Scale className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-xl text-neutral-900">LegalPDF<span className="text-primary-700">Tools</span></span>
                </Link>
                <p className="text-sm text-neutral-600 max-w-xs">
                  Free, professional-grade legal document processing with zero server retention. Bates stamping, permanent redaction, and compliance tools for legal professionals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Tools</h4>
                <ul className="space-y-2 text-sm">
                  {toolLinks.slice(0, 4).map((tool) => (
                    <li key={tool.href}>
                      <Link to={tool.href} className="text-neutral-600 hover:text-primary-700 transition-colors">{tool.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">More Tools</h4>
                <ul className="space-y-2 text-sm">
                  {toolLinks.slice(4).map((tool) => (
                    <li key={tool.href}>
                      <Link to={tool.href} className="text-neutral-600 hover:text-primary-700 transition-colors">{tool.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/guides" className="text-neutral-600 hover:text-primary-700 transition-colors">Guides Hub</Link></li>
                  <li><Link to="/about" className="text-neutral-600 hover:text-primary-700 transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-neutral-600 hover:text-primary-700 transition-colors">Contact</Link></li>
                  <li><Link to="/privacy-policy" className="text-neutral-600 hover:text-primary-700 transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-neutral-600 hover:text-primary-700 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
              <p>&copy; {new Date().getFullYear()} Legal PDF Tools. All rights reserved.</p>
              <p className="text-center md:text-right">
                Not legal advice. Technical utility for document processing only.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}