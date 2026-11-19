import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FileText, Shield, Scale, Brain, ChevronRight, BookOpen, Clock, CheckCircle } from 'lucide-react'
import Layout from '../../components/Layout'
import AdSlot from '../../components/AdSlot'

const guides = [
  {
    slug: '/guides/what-is-bates-numbering-in-legal-discovery',
    title: 'What Is Bates Numbering in Legal Discovery?',
    description: 'Complete guide to Bates numbering: history, format standards, court rules, discovery production protocols, and modern digital implementation.',
    icon: Scale,
    readTime: '12 min',
    tags: ['Discovery', 'Court Rules', 'Formatting'],
  },
  {
    slug: '/guides/how-to-permanently-redact-pdf-without-metadata-leaks',
    title: 'How to Permanently Redact PDFs Without Metadata Leaks',
    description: 'Technical guide to true PDF redaction: text-layer destruction vs. visual masking, metadata sanitization, forensic recovery prevention, and tool validation.',
    icon: Shield,
    readTime: '15 min',
    tags: ['Redaction', 'Security', 'Forensics'],
  },
  {
    slug: '/guides/federal-court-exhibit-stamping-formatting-rules',
    title: 'Federal Court Exhibit Stamping & Formatting Rules',
    description: 'Federal and state court exhibit formatting requirements: Bates prefix conventions, stamp positioning, font standards, margin rules, and local rule variations.',
    icon: FileText,
    readTime: '10 min',
    tags: ['Court Rules', 'Exhibits', 'Formatting'],
  },
  {
    slug: '/guides/hipaa-and-pii-redaction-checklist-for-paralegals',
    title: 'HIPAA & PII Redaction Checklist for Paralegals',
    description: 'Step-by-step checklist for HIPAA Safe Harbor de-identification, PII detection patterns, medical record redaction workflows, and quality assurance procedures.',
    icon: Brain,
    readTime: '14 min',
    tags: ['HIPAA', 'PHI', 'Paralegal Workflow'],
  },
]

export default function GuidesHub() {
  return (
    <Layout pageConfig={{ title: 'Legal Document Processing Guides', description: 'Authoritative guides on Bates numbering, PDF redaction, court exhibit formatting, and HIPAA/PCI compliance for legal professionals.' }}>
      <Helmet>
        <title>Legal Document Processing Guides — Expert Resources</title>
        <meta name="description" content="Authoritative guides on Bates numbering, PDF redaction, court exhibit formatting, and HIPAA/PCI compliance for legal professionals." />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-700 mb-6">
              <BookOpen className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="section-heading">Legal Document Processing Guides</h1>
            <p className="section-subheading mt-4 max-w-2xl mx-auto">
              Authoritative, practical resources for legal professionals. Written by experts, grounded in court rules and compliance standards.
            </p>
          </header>

          <div className="space-y-8">
            {guides.map((guide, index) => (
              <Link
                key={guide.slug}
                to={guide.slug}
                className="card group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 group-hover:bg-primary-700 transition-colors duration-300 flex-shrink-0">
                    <guide.icon className="h-7 w-7 text-primary-700 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {guide.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {guide.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors mb-2">
                      {guide.title}
                    </h2>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {guide.description}
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
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Ready to Apply What You've Learned?</h2>
                <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
                  Put these guides into practice with our free, professional-grade tools. No signup, zero server retention, instant processing.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/" className="btn-primary">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                    Try Bates Stamping & Redaction
                  </Link>
                  <Link to="/guides/what-is-bates-numbering-in-legal-discovery" className="btn-secondary">
                    Start Reading Guides
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Slot */}
          <AdSlot slotName="guides-hub" />
        </div>
      </article>
    </Layout>
  )
}