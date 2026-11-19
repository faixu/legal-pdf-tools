import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Shield, Lock, Brain, Zap, Code, Users, Heart, Scale } from 'lucide-react'
import Layout from '../../components/Layout'

export default function About() {
  return (
    <Layout pageConfig={{ title: 'About Legal PDF Tools', description: 'Learn about our mission to provide free, professional-grade legal document processing tools with zero server retention and maximum privacy.' }}>
      <Helmet>
        <title>About Legal PDF Tools — Free Bates Stamping & Redaction</title>
        <meta name="description" content="Learn about our mission to provide free, professional-grade legal document processing tools with zero server retention and maximum privacy." />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-700 mb-6">
              <Scale className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="section-heading">About Legal PDF Tools</h1>
            <p className="section-subheading mt-4 max-w-2xl mx-auto">
              Professional legal document processing, free forever, with privacy as the default.
            </p>
          </header>

          <div className="prose prose-neutral max-w-none space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Why We Built This
              </h2>
              <p className="content-text mb-4">
                Legal professionals spend thousands of dollars annually on desktop software for basic document processing: Bates stamping exhibits, redacting confidential information, adding privilege stamps. These tools are essential — but they shouldn't require enterprise budgets, account creation, or cloud uploads of sensitive client documents.
              </p>
              <p className="content-text mb-4">
                We asked a simple question: <em>What if professional-grade PDF processing ran entirely in your browser, with zero server retention, no signup, and no cost?</em>
              </p>
              <p className="content-text">
                The answer is Legal PDF Tools. Built on PyMuPDF (fitz) compiled to WebAssembly, our tool brings the same redaction and stamping engine used in enterprise legal software directly to your browser — no installation, no data leaving your device, no strings attached.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Our Principles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 mb-4">
                    <Lock className="h-5 w-5 text-green-700" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Privacy First</h3>
                  <p className="text-neutral-600 text-sm">Files never leave your browser. Processed in volatile RAM. Zero server retention. No analytics on document content.</p>
                </div>
                <div className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mb-4">
                    <Zap className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Free Forever</h3>
                  <p className="text-neutral-600 text-sm">No trials, no tiers, no usage limits. Core functionality will always be free. Supported by optional ads, not user data.</p>
                </div>
                <div className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 mb-4">
                    <Code className="h-5 w-5 text-purple-700" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Professional Grade</h3>
                  <p className="text-neutral-600 text-sm">PyMuPDF's apply_redactions() with PDF_REDACT_IMAGE_PIXELS — true text-layer destruction, not visual masking.</p>
                </div>
                <div className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 mb-4">
                    <Users className="h-5 w-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Accessible to All</h3>
                  <p className="text-neutral-600 text-sm">Solo practitioners, legal aid clinics, paralegals, law students — everyone deserves professional tools.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Technology Stack
              </h2>
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-semibold text-neutral-900 mb-2">Backend (Optional API)</h3>
                  <ul className="space-y-1 content-text text-sm">
                    <li><strong>FastAPI</strong> — Modern, fast Python web framework</li>
                    <li><strong>PyMuPDF (fitz)</strong> — Industry-standard PDF manipulation library</li>
                    <li><strong>Pydantic</strong> — Runtime validation and serialization</li>
                    <li><strong>Uvicorn</strong> — ASGI server for production deployment</li>
                  </ul>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-neutral-900 mb-2">Frontend</h3>
                  <ul className="space-y-1 content-text text-sm">
                    <li><strong>React 18</strong> — Component-based UI with concurrent features</li>
                    <li><strong>Vite</strong> — Lightning-fast build tool and dev server</li>
                    <li><strong>Tailwind CSS</strong> — Utility-first styling, zero-runtime</li>
                    <li><strong>React Router</strong> — Client-side routing for SEO pages</li>
                    <li><strong>React Helmet Async</strong> — Dynamic meta tags and JSON-LD</li>
                  </ul>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-neutral-900 mb-2">Processing Engine</h3>
                  <ul className="space-y-1 content-text text-sm">
                    <li><strong>WebAssembly PyMuPDF</strong> — Full PDF engine in browser</li>
                    <li><strong>io.BytesIO</strong> — Zero-disk, in-memory processing</li>
                    <li><strong>apply_redactions(images=PDF_REDACT_IMAGE_PIXELS)</strong> — Permanent text destruction</li>
                    <li><strong>garbage=4, deflate=True</strong> — Maximum compression on output</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary-700" aria-hidden="true" />
                For the Legal Community
              </h2>
              <p className="content-text mb-4">
                We built specialized tool variants for common legal workflows because we understand one size doesn't fit all:
              </p>
              <ul className="space-y-3 content-text">
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>Court Exhibits:</strong> EXHIBIT-A- prefix, top-right, Times-Roman — federal court standard</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>Discovery Productions:</strong> PROD- prefix, 7 digits — high-volume document productions</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>PII Redaction:</strong> Auto-detect SSN, Aadhaar, emails — HIPAA/GLBA aligned</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>Confidential Stamps:</strong> CONFIDENTIAL- bottom-center, Courier — protective order compliance</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>Financial Redaction:</strong> Account, routing, SWIFT keywords — PCI-DSS aware</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>HIPAA Medical Records:</strong> 18 Safe Harbor identifiers — PHI de-identification</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> <strong>Paralegal Exhibit Generator:</strong> Case prefixes, batch export, CSV manifests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Transparency & Sustainability</h2>
              <p className="content-text mb-4">
                This service is sustained by Google AdSense advertisements — clearly marked, never overlapping tool functionality, and compliant with AdSense policies. We do not sell user data. We do not track document content. We do not build user profiles.
              </p>
              <p className="content-text mb-4">
                If you find the tool valuable, the best support is sharing it with colleagues who need it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact</h2>
              <p className="content-text">
                Feedback, feature requests, bug reports: <a href="mailto:hello@legalpdftools.com" className="text-primary-700 hover:underline">hello@legalpdftools.com</a>
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-200 text-center">
            <Link to="/" className="btn-primary inline-flex">
              <Zap className="h-5 w-5" aria-hidden="true" />
              Try the Tool Now
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  )
}