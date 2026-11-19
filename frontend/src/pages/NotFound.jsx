import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Scale, Home, Search, ChevronLeft } from 'lucide-react'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout pageConfig={{ title: 'Page Not Found', description: 'The page you are looking for does not exist.' }}>
      <Helmet>
        <title>Page Not Found — Legal PDF Tools</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <article className="px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary-100 mb-8">
            <Scale className="h-10 w-10 text-primary-700" aria-hidden="true" />
          </div>
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              <Home className="h-5 w-5" aria-hidden="true" />
              Back to Home
            </Link>
            <Link to="/guides" className="btn-secondary">
              <Search className="h-5 w-5" aria-hidden="true" />
              Browse Guides
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              Popular destinations:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm">
              <Link to="/bates-stamp-court-exhibits" className="text-primary-700 hover:underline">Court Exhibits</Link>
              <span className="text-neutral-300">·</span>
              <Link to="/redact-ssn-from-pdf" className="text-primary-700 hover:underline">Redact SSN & PII</Link>
              <span className="text-neutral-300">·</span>
              <Link to="/bates-number-discovery-documents" className="text-primary-700 hover:underline">Discovery Productions</Link>
              <span className="text-neutral-300">·</span>
              <Link to="/confidential-stamp-pdf" className="text-primary-700 hover:underline">Confidential Stamps</Link>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  )
}