import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, MessageSquare, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react'

export default function Contact() {
  const pageConfig = {
    title: 'Contact Us',
    description: 'Contact support for the legal PDF processing tool. Report issues, suggest features, or inquire about enterprise deployment.',
    canonical: 'https://legalbates.vercel.app/contact'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState(null) // 'success', 'error', 'sending'
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setStatus('sending')

    try {
      // In production, this would POST to your backend or a service like Formspree, EmailJS, etc.
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success (replace with actual API call)
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us — Legal PDF Tools Support</title>
        <meta name="description" content="Contact support for the legal PDF processing tool. Report issues, suggest features, or inquire about enterprise deployment." />
        <link rel="canonical" href="https://legalbates.vercel.app/contact" />
      </Helmet>

      <article className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 text-center">
            <h1 className="section-heading">Contact Us</h1>
            <p className="section-subheading mt-4">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="card h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 mb-4">
                  <Mail className="h-6 w-6 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Email Support</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  For technical issues, feature requests, or general inquiries.
                </p>
                <a href="mailto:support@legalpdftools.com" className="text-primary-700 hover:underline font-medium text-sm flex items-center gap-1">
                  support@legalpdftools.com
                  <Send className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="card h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
                  <MessageSquare className="h-6 w-6 text-green-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Privacy & Legal</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  For privacy concerns, data requests, or legal inquiries.
                </p>
                <a href="mailto:privacy@legalpdftools.com" className="text-primary-700 hover:underline font-medium text-sm flex items-center gap-1">
                  privacy@legalpdftools.com
                  <Send className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="card h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Response Time</h3>
                <p className="text-neutral-600 text-sm">
                  We typically respond within 1-2 business days. For urgent production issues, please indicate "URGENT" in the subject line.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Send a Message</h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in" role="alert">
                <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-green-900">Message Sent Successfully</p>
                  <p className="text-green-700 text-sm mt-1">Thank you for reaching out. We'll get back to you within 1-2 business days.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in" role="alert">
                <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-red-900">Something Went Wrong</p>
                  <p className="text-red-700 text-sm mt-1">Please try again or email us directly at support@legalpdftools.com</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="label-text" htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Your full name"
                  disabled={status === 'sending'}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="label-text" htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@domain.com"
                  disabled={status === 'sending'}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="label-text" htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={`input-field ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={status === 'sending'}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                >
                  <option value="">Select a topic</option>
                  <option value="technical">Technical Issue / Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing / Ads Question</option>
                  <option value="privacy">Privacy / Data Request</option>
                  <option value="legal">Legal / Compliance</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="label-text" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`input-field min-h-[120px] ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Describe your issue, request, or feedback in detail..."
                  rows={5}
                  disabled={status === 'sending'}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">{errors.message}</p>
                )}
                {!errors.message && (
                  <p id="message-hint" className="mt-1 text-xs text-neutral-500">Minimum 20 characters</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full sm:w-auto"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Prefer email? <a href="mailto:support@legalpdftools.com" className="text-primary-700 hover:underline font-medium">support@legalpdftools.com</a>
            </p>
          </div>
        </div>
      </article>
    </>
  )
}