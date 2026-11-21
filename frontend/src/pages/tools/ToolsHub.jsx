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

const ToolCard = ({ tool, index }) => (
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
          {tool.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock className="h-3 w-3" aria-hidden="true" />
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
)

export default function ToolsHub() {
  return (
    <Layout pageConfig={{ title: 'Legal Document Processing Tools', description: 'Free, professional-grade legal document processing tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup required.' }}>
      <Helmet>
        <title>Legal Document Processing Tools — Free Bates Stamping & Redaction</title>
        <meta name="description" content="Free, professional-grade legal document processing tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup required." />
        <link rel="canonical" href="https://legalpdftools.com/tools" />
      </Helmet>

      <div className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-700 mb-6">
              <Scale className="h-7 w-7 text-white" aria-hidden="true" />
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
                      {tool.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock className="h-3 w-3" aria-hidden="true" />
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

            {/* Comparison Table */}
            <section className="px-4 py-16 bg-white">
              <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                  <h2 className="section-heading">LegalBates vs. The Competition</h2>
                  <p className="section-subheading">
                    Why legal teams choose LegalBates over other PDF tools
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="text-left p-4 font-semibold text-neutral-900">Criteria</th>
                        <th className="p-4 font-semibold text-neutral-900 text-center">
                          <span className="font-semibold text-neutral-900">LegalBates</span>
                          <br /><span className="text-xs text-neutral-500">(legalpdftools.com)</span>
                        </th>
                        <th className="p-4 font-semibold text-neutral-900 text-center">
                          <span className="font-semibold text-neutral-900">Free Online Tools</span>
                          <br /><span className="text-xs text-neutral-500">(iLovePDF, Smallpdf, Xodo)</span>
                        </th>
                        <th className="p-4 font-semibold text-neutral-900 text-center">
                          <span className="font-semibold text-neutral-900">Cloud AI Redactors</span>
                          <br /><span className="text-xs text-neutral-500">(Redactable, Redact.ai)</span>
                        </th>
                        <th className="p-4 font-semibold text-neutral-900 text-center">
                          <span className="font-semibold text-neutral-900">Enterprise Desktop</span>
                          <br /><span className="text-xs text-neutral-500">(Adobe Acrobat Pro)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className="hover:bg-neutral-50">
                        <td className="p-4 font-medium text-neutral-900">Data Privacy</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ 100% Client-Side</td>
                        <td className="p-4 text-center text-red-700">❌ Upload to 3rd-Party</td>
                        <td className="p-4 text-center text-red-700">❌ Cloud AI Servers</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Local (with telemetry)</td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="p-4 font-medium text-neutral-900">True Data Removal</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ PDF_REDACT_IMAGE_PIXELS</td>
                        <td className="p-4 text-center text-red-700">❌ Visual Mask Only</td>
                        <td className="p-4 text-center text-yellow-700">⚠️ Varies / Cloud OCR</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Native applyRedaction()</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Custom Redaction Overlays</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Custom Codes</td>
                        <td className="p-4 text-center text-red-700">❌ Black Box Only</td>
                        <td className="p-4 text-center text-yellow-700">⚠️ Limited Presets</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Custom Overlays</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Native Bates Stamping</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Native (5 positions)</td>
                        <td className="p-4 text-center text-red-700">❌ Separate Tool</td>
                        <td className="p-4 text-center text-red-700">❌ Separate Tool</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Native (Complex UI)</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Redaction + Bates in One Pass</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Single Pass</td>
                        <td className="p-4 text-center text-red-700">❌ Multiple Tools</td>
                        <td className="p-4 text-center text-red-700">❌ Separate Workflows</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Possible (Complex UI)</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Pricing & Account Friction</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Free / No Sign-up</td>
                        <td className="p-4 text-center text-yellow-700">Freemium / Watermarks</td>
                        <td className="p-4 text-center text-red-700">$50–500+/mo Subscription</td>
                        <td className="p-4 text-center text-red-700 font-medium">$239.88/yr Subscription</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Speed & Setup</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Instant (Browser)</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Instant</td>
                        <td className="p-4 text-center text-yellow-700">API Key + Integration</td>
                        <td className="p-4 text-center text-yellow-700">Install + License</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">File Size Limit</td>
                        <td className="p-4 text-center text-green-700 font-medium">50MB (Browser)</td>
                        <td className="p-4 text-center text-yellow-700">5–100MB Limits</td>
                        <td className="p-4 text-center text-yellow-700">API Limits</td>
                        <td className="p-4 text-center text-green-700 font-medium">None (Local)</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">CSP / Security Headers</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Strict CSP + HSTS</td>
                        <td className="p-4 text-center text-yellow-700">Varies</td>
                        <td className="p-4 text-center text-yellow-700">Varies</td>
                        <td className="p-4 text-center text-green-700 font-medium">Local Only</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-neutral-900">Zero-Retention Guarantee</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Files Never Leave Browser</td>
                        <td className="p-4 text-center text-red-700">❌ Stored on Servers</td>
                        <td className="p-4 text-center text-red-700">❌ Cloud Processing</td>
                        <td className="p-4 text-center text-green-700 font-medium">✅ Local Only</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        {/* Why Legal Teams Switch to LegalBates */}
        <section className="px-4 py-16 bg-neutral-50">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="section-heading">Why Legal Teams Switch to LegalBates</h2>
              <p className="section-subheading">
                The only tool that combines true redaction, native Bates stamping, and zero-upload privacy
              </p>
            </div>

            <div className="prose prose-neutral max-w-none space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card bg-primary-50 border-primary-100 p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    True Redaction, Not Masking
                  </h3>
                  <p className="content-text text-neutral-700">
                    LegalBates uses PyMuPDF's <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">apply_redactions(PDF_REDACT_IMAGE_PIXELS)</code> to rasterize redacted regions into pixels—permanently destroying text vectors, font data, and metadata. No copy-paste extraction. No OCR recovery. No hidden layers.
                  </p>
                </div>
                <div className="card bg-green-50 border-green-100 p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-700" aria-hidden="true" />
                    Custom Court-Compliant Overlays
                  </h3>
                  <p className="content-text text-neutral-700">
                    Apply exemption codes directly on the redaction box: <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">PRIVILEGED</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">FOIA b(6)</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">HIPAA PHI</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">ATTORNEY-CLIENT PRIVILEGE</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">FOIA b(6)</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">WORK PRODUCT</code>, or your custom exemption code. Overlays are rasterized into pixels—cannot be peeled off or selected.
                  </p>
                </div>
                <div className="card bg-purple-50 border-purple-100 p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-purple-700" aria-hidden="true" />
                    Native Bates Stamping — One Pass
                  </h3>
                  <p className="content-text text-neutral-700">
                    Apply <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">EXHIBIT-A-0001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">PROD-0000001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">CONF-0001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">MED-000001</code>, or custom prefixes in the same pass as redaction. No round-tripping between tools.
                  </p>
                </div>
                <div className="card bg-orange-50 border-orange-100 p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-orange-700" aria-hidden="true" />
                    Zero-Retention Architecture
                  </h3>
                  <p className="content-text text-neutral-700">
                    Files process entirely in your browser via WebAssembly (PyMuPDF). No uploads. No server. No logs. No tracking. Files never leave your browser memory.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  Why Legal Teams Switch to LegalBates
                </h3>
                <div className="prose prose-neutral max-w-none space-y-6">
                  <p className="content-text">
                    <strong>True Redaction, Not Masking.</strong> LegalBates uses PyMuPDF's <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">apply_redactions(PDF_REDACT_IMAGE_PIXELS)</code> to rasterize redacted regions into pixels—permanently destroying text vectors, font data, and metadata. No copy-paste extraction. No OCR recovery. No hidden layers.
                  </p>
                  <p className="content-text">
                    <strong>Custom Court-Compliant Overlays.</strong> Apply exemption codes directly on the redaction box: <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">PRIVILEGED</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">FOIA b(6)</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">HIPAA PHI</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">ATTORNEY-CLIENT PRIVILEGE</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">FOIA b(6)</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">WORK PRODUCT</code>, or your custom exemption code. Overlays are rasterized into pixels—cannot be peeled off or selected.
                  </p>
                  <p className="content-text">
                    <strong>Native Bates Stamping — One Pass.</strong> Apply <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">EXHIBIT-A-0001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">PROD-0000001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">CONF-0001</code>, <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">MED-000001</code>, or custom prefixes in the same pass as redaction. No round-tripping between tools.
                  </p>
                  <p className="content-text">
                    <strong>Zero-Retention Architecture.</strong> Files process entirely in your browser via WebAssembly (PyMuPDF). No uploads. No server. No logs. No tracking. Files never leave your browser memory.
                  </p>
                  <p className="content-text">
                    <strong>Free. No Sign-Up. No Limits.</strong> No watermarks. No file size limits (50MB browser limit). No account required. Ever.
                  </p>
                  <p className="content-text">
                    <strong>Built for Legal Professionals Who Can't Afford Leaks.</strong> Used by AmLaw 100 firms, public defenders, compliance teams, and solo practitioners who can't afford metadata leaks, sanctions, or privilege waivers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot slotName="tools-hub" />
      </div>
      </div>
    </Layout>
  )
}