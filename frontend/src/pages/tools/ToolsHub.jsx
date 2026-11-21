import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Scale, Shield, FileText, Lock, Brain, FileSearch, Users, ChevronRight, BookOpen, Clock, CheckCircle, Scale as ScaleIcon } from 'lucide-react'
import Layout from '../../components/Layout'
import AdSlot from '../../components/AdSlot'

const tools = [
  {
    slug: '/bates-stamp-court-exhibits',
    title: 'Court Exhibits',
    description: 'EXHIBIT-A- prefix, top-right, Times-Roman 11pt',
    icon: Scale,
    readTime: '2 min',
    tags: ['Court', 'Exhibits', 'FRCP'],
  },
  {
    slug: '/bates-number-discovery-documents',
    title: 'Discovery Productions',
    description: 'PROD- prefix, 7 digits, high-volume ready',
    icon: FileSearch,
    readTime: '2 min',
    tags: ['Discovery', 'Production', 'High-Volume'],
  },
  {
    slug: '/redact-ssn-from-pdf',
    title: 'Redact SSN & PII',
    description: 'Auto-detect SSN, Aadhaar, emails',
    icon: Shield,
    readTime: '2 min',
    tags: ['Redaction', 'PII', 'HIPAA'],
  },
  {
    slug: '/bates-number-discovery-documents',
    title: 'Discovery Productions',
    description: 'PROD- prefix, 7 digits, high-volume ready',
    icon: FileSearch,
    readTime: '2 min',
    tags: ['Discovery', 'Production', 'High-Volume'],
  },
  {
    slug: '/confidential-stamp-pdf',
    title: 'Confidential Stamps',
    description: 'CONFIDENTIAL- bottom-center, Courier 14pt',
    icon: Lock,
    readTime: '2 min',
    tags: ['Confidential', 'Privilege', 'Protective Orders'],
  },
  {
    slug: '/redact-bank-account-numbers-pdf',
    title: 'Financial Redaction',
    description: 'Account, routing, SWIFT, IBAN keywords',
    icon: FileText,
    readTime: '2 min',
    tags: ['Financial', 'GLBA', 'PCI-DSS'],
  },
  {
    slug: '/medical-records-hipaa-pdf-redaction',
    title: 'HIPAA Medical Records',
    description: 'PHI Safe Harbor 18 identifiers',
    icon: Brain,
    readTime: '2 min',
    tags: ['HIPAA', 'PHI', 'Medical'],
  },
  {
    slug: '/law-firm-pdf-exhibit-generator',
    title: 'Paralegal Exhibit Gen',
    description: 'Case prefixes, batch export, manifests',
    icon: Users,
    readTime: '2 min',
    tags: ['Paralegal', 'Workflow', 'Batch'],
  },
]

export default function ToolsHub() {
  return (
    <Layout pageConfig={{ title: 'Legal Document Processing Tools', description: 'Free, professional-grade legal document processing tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup required.' }}>
      <Helmet>
        <title>Legal Document Processing Tools — Free Bates Stamping & Redaction</title>
        <meta name="description" content="Free, professional-grade legal document processing tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup required." />
        <link rel="canonical" href="https://legalpdftools.com/tools" />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-700 mb-6">
              <ScaleIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="section-heading">Legal Document Processing Tools</h1>
            <p className="section-subheading mt-4 max-w-2xl mx-auto">
              Free, professional-grade tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup, instant processing.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.slug}
                to={tool.slug}
                className="card group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 group-hover:bg-primary-700 transition-colors duration-300 flex-shrink-0">
                    <tool.icon className="h-7 w-7 text-primary-700 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">Tool</span>
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <span className="h-3 w-3" aria-hidden="true">⏱</span>
                        {tool.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors mb-2">
                      {tool.title}
                    </h2>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-end flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <section className="mt-16 pt-12 border-t border-neutral-200">
            <div className="card bg-primary-50 border-primary-100">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Ready to Get Started?</h2>
                <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
                  Pick a tool above or start with the main all-in-one processor. No signup, zero server retention, instant processing.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/" className="btn-primary">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                    Try Main Processor
                  </Link>
                  <Link to="/guides" className="btn-secondary">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Read Guides
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Slot */}
          <AdSlot slotName="tools-hub" />
        </div>
      </article>
    </Layout>
  )
}