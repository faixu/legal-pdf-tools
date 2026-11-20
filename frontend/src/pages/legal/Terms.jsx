import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Scale, AlertTriangle, Shield, FileText } from 'lucide-react'

export default function Terms() {
  const pageConfig = {
    title: 'Terms of Service',
    description: 'Terms of service for the free legal PDF processing tool. Disclaimer: this is a technical utility, not legal advice. No warranty, no liability.',
    canonical: 'https://legalbates.vercel.app/terms'
  };

  return (
    <>
      <Helmet>
        <title>Terms of Service — Legal PDF Tools</title>
        <meta name="description" content="Terms of service for the free legal PDF processing tool. Disclaimer: this is a technical utility, not legal advice. No warranty, no liability." />
        <link rel="canonical" href={pageConfig.canonical} />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 text-center">
            <h1 className="section-heading">Terms of Service</h1>
            <p className="section-subheading mt-4">Last updated: November 2026</p>
          </header>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary-700" aria-hidden="true" />
                1. Service Description
              </h2>
              <p className="content-text mb-4">
                Legal PDF Tools ("the Service") provides free, browser-based PDF processing utilities for Bates numbering and permanent redaction. The Service is a technical utility — it applies algorithmic transformations to PDF documents. It does not provide legal advice, legal opinions, or legal strategy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden="true" />
                2. Not Legal Advice — Critical Disclaimer
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <p className="font-semibold text-amber-900 mb-3">IMPORTANT: READ CAREFULLY</p>
                <ul className="space-y-2 content-text text-amber-800 list-none">
                  <li className="flex items-start gap-2"><span>•</span> This tool does not constitute legal advice.</li>
                  <li className="flex items-start gap-2"><span>•</span> No attorney-client relationship is created.</li>
                  <li className="flex items-start gap-2"><span>•</span> Output may not comply with your jurisdiction's specific court rules.</li>
                  <li className="flex items-start gap-2"><span>•</span> You are responsible for verifying all output meets applicable requirements.</li>
                  <li className="flex items-start gap-2"><span>•</span> Consult a licensed attorney for legal questions.</li>
                </ul>
              </div>
              <p className="content-text">
                Bates numbering conventions, redaction standards, and exhibit formatting requirements vary by court, jurisdiction, and case type. This tool provides technical capability — you must ensure compliance with your specific legal obligations.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                3. No Warranty
              </h2>
              <p className="content-text mb-4">
                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied, including but not limited to:
              </p>
              <ul className="space-y-2 content-text ml-4 list-none">
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Merchantability or fitness for a particular purpose</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Accuracy, completeness, or reliability of output</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Compliance with any court rule, statute, or regulation</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Uninterrupted or error-free operation</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Security or absence of vulnerabilities</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
                4. Limitation of Liability
              </h2>
              <p className="content-text mb-4">
                To the maximum extent permitted by law, Legal PDF Tools and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="space-y-2 content-text ml-4 list-none">
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Loss of data, documents, or work product</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Court sanctions, adverse rulings, or legal penalties</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Privacy violations or data breaches</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Lost profits, revenue, or business opportunities</li>
              </ul>
              <p className="content-text mt-4">
                Your sole remedy for dissatisfaction is to discontinue use of the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. User Responsibilities</h2>
              <p className="content-text mb-4">By using the Service, you agree to:</p>
              <ul className="space-y-2 content-text ml-4 list-none">
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Use the tool only for lawful purposes</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Not upload malicious, corrupted, or password-protected PDFs designed to exploit the system</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Verify all output before use in any legal proceeding</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Not attempt to reverse engineer, decompile, or extract source code</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Not use automated systems to overload the Service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">6. Intellectual Property</h2>
              <p className="content-text mb-4">
                The Service's code, design, and documentation are proprietary. You retain all rights to documents you process. We claim no ownership over your input or output files.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">7. Third-Party Services</h2>
              <p className="content-text mb-4">
                The Service may display advertisements via Google AdSense and load fonts from Google Fonts. Your use of those services is governed by their respective terms and privacy policies.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">8. Modifications and Termination</h2>
              <p className="content-text mb-4">
                We may modify, suspend, or discontinue the Service at any time without notice. We may update these Terms at any time; continued use constitutes acceptance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">9. Governing Law</h2>
              <p className="content-text mb-4">
                These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">10. Contact</h2>
              <p className="content-text">
                Questions about these Terms? Email <a href="mailto:legal@legalpdftools.com" className="text-primary-700 hover:underline">legal@legalpdftools.com</a>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link to="/" className="btn-secondary">
              ← Back to Tool
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}