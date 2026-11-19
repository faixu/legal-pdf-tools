import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Shield, Lock, Database, Monitor, Mail, ExternalLink } from 'lucide-react'
import Layout from '../../components/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout pageConfig={{ title: 'Privacy Policy', description: 'Privacy policy for Legal PDF Tools covering zero server retention, browser-local processing, cookies, and Google AdSense.' }}>
      <Helmet>
        <title>Privacy Policy — Legal PDF Tools</title>
        <meta name="description" content="Our privacy policy covers zero server file retention, browser-local processing, cookie usage, and Google AdSense third-party advertising. No personal data collected." />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 text-center">
            <h1 className="section-heading">Privacy Policy</h1>
            <p className="section-subheading mt-4">Last updated: November 2026</p>
          </header>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Our Core Principle: Zero Server Retention
              </h2>
              <p className="content-text mb-4">
                Legal PDF Tools is designed from the ground up with privacy as the default. When you use our Bates stamping and redaction tools, your PDF files never leave your browser. All processing occurs in volatile RAM using WebAssembly-compiled PyMuPDF. Once you download the processed file or close the tab, the data is gone — no server logs, no temporary storage, no backups.
              </p>
              <p className="content-text mb-4">
                This is not a marketing claim — it's an architectural constraint. Our backend API exists solely for users who explicitly choose server-side processing (clearly labeled), and even then, files are streamed through memory with zero disk persistence.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Data We Do Not Collect
              </h2>
              <ul className="space-y-3 content-text">
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> No PDF file content or metadata</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> No personally identifiable information (names, emails, case numbers)</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> No usage analytics tied to individuals</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> No IP address logging for tool usage</li>
                <li className="flex items-start gap-3"><span className="text-primary-700">•</span> No account creation — no passwords, no credentials</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Browser-Local Storage
              </h2>
              <p className="content-text mb-4">
                Your tool preferences (recent prefixes, font choices, window positions) are stored exclusively in your browser's <code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">localStorage</code>. This data never transmits to our servers. You can clear it anytime via your browser settings or by using the "Reset Tool" button in the interface.
              </p>
              <p className="content-text mb-4">
                No cookies are set by our application for functionality. The only cookies you may encounter are from third-party services described below.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Third-Party Services
              </h2>

              <h3 className="font-medium text-neutral-900 mb-3">Google AdSense</h3>
              <p className="content-text mb-4">
                We display advertisements via Google AdSense to keep this tool free. Google may use cookies or similar technologies to serve personalized ads based on your visit to this and other sites. Google's use of advertising cookies enables it and its partners to serve ads based on your browsing activity.
              </p>
              <p className="content-text mb-4">
                You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">Network Advertising Initiative Opt-Out</a>.
              </p>

              <h3 className="font-medium text-neutral-900 mb-3 mt-6">Google Fonts</h3>
              <p className="content-text mb-4">
                We load the Inter and JetBrains Mono fonts from Google Fonts. This request transmits your IP address to Google. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">Google's Privacy Policy</a>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Server-Side Processing (Opt-In Only)
              </h2>
              <p className="content-text mb-4">
                If you explicitly use the backend API endpoint (<code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">/api/process-pdf</code>), files are streamed to our server for processing. Even then:
              </p>
              <ul className="space-y-2 content-text ml-4">
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Files processed in RAM only (<code className="bg-neutral-100 px-1.5 rounded font-mono text-sm">io.BytesIO</code>)</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Zero disk writes — no temporary files</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Response streamed directly back — no retention</li>
                <li className="flex items-start gap-2"><span className="text-primary-700">•</span> Maximum file size: 50MB</li>
              </ul>
              <p className="content-text mt-4">
                Server access logs capture only timestamp, endpoint, and HTTP status — never file content, filenames, or user identifiers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary-700" aria-hidden="true" />
                Contact Form Data
              </h2>
              <p className="content-text mb-4">
                If you use our contact form, we collect only the information you voluntarily provide: name, email, and message. This data is used solely to respond to your inquiry and is never shared, sold, or used for marketing. Contact form submissions are transmitted via HTTPS and stored temporarily in our email system for response tracking.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Your Rights</h2>
              <p className="content-text mb-4">
                Since we don't collect personal data in connection with tool usage, there's no personal data to access, rectify, or delete. For contact form data, you may request deletion by emailing us.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Children's Privacy</h2>
              <p className="content-text">
                Our tools are not directed at children under 13. We do not knowingly collect data from children. If you believe a child has submitted contact form data, please contact us for immediate deletion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Changes to This Policy</h2>
              <p className="content-text">
                We may update this policy to reflect changes in our practices or legal requirements. The "Last updated" date at the top indicates the most recent revision. Continued use of the tools after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact</h2>
              <p className="content-text">
                Questions about this policy? Email <a href="mailto:privacy@legalpdftools.com" className="text-primary-700 hover:underline">privacy@legalpdftools.com</a>.
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
    </Layout>
  )
}