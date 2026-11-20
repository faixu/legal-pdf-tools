import { useState, useRef, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, Settings, Eye, EyeOff, Copy, Trash2, Plus, Minus, Shield, Lock, Brain, Sparkles } from 'lucide-react'
import AdSlot from './AdSlot'

// Use relative path for Vercel rewrite /api/* -> backend service
// Falls back to VITE_API_URL for local development
const API_URL = import.meta.env.VITE_API_URL || ''

const positionOptions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
]

const fontOptions = [
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Courier', label: 'Courier' },
  { value: 'Times-Roman', label: 'Times Roman' },
]

export default function PDFTool({ preset }) {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [batesPreview, setBatesPreview] = useState('')
  const fileInputRef = useRef(null)
  const dragActiveRef = useRef(false)

  // Form state with preset defaults
  const [formData, setFormData] = useState({
    enableBates: preset?.enableBates ?? true,
    prefix: preset?.prefix ?? 'CASE-',
    startNum: preset?.startNum ?? 1,
    digits: preset?.digits ?? 6,
    suffix: preset?.suffix ?? '',
    position: preset?.position ?? 'bottom-right',
    fontName: preset?.fontName ?? 'Helvetica',
    fontSize: preset?.fontSize ?? 10,
    margin: preset?.margin ?? 24,
    redactKeywords: preset?.redactKeywords ?? '',
    redactFillLabel: preset?.redactFillLabel ?? 'REDACTED',
    redactPiiRegex: preset?.redactPiiRegex ?? false,
  })

  // Live Bates preview
  useEffect(() => {
    if (formData.enableBates) {
      const preview = `${formData.prefix}${String(formData.startNum).padStart(formData.digits, '0')}${formData.suffix}`
      setBatesPreview(preview)
    } else {
      setBatesPreview('')
    }
  }, [formData.enableBates, formData.prefix, formData.startNum, formData.digits, formData.suffix])

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return

    // Client-side validation (defense in depth)
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit')
      return
    }

    // Check file extension
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('File must have .pdf extension')
      return
    }

    setFile(selectedFile)
    setError(null)
    setResult(null)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragActiveRef.current = true
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragActiveRef.current = false
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragActiveRef.current = false
    if (e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleNumberChange = (field, delta) => {
    setFormData(prev => {
      const current = prev[field] || 0
      const next = Math.max(1, current + delta)
      return { ...prev, [field]: next }
    })
  }

  const processPDF = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formDataApi = new FormData()
      formDataApi.append('file', file)
      formDataApi.append('enable_bates', formData.enableBates)
      formDataApi.append('prefix', formData.prefix)
      formDataApi.append('start_num', formData.startNum)
      formDataApi.append('digits', formData.digits)
      formDataApi.append('suffix', formData.suffix)
      formDataApi.append('position', formData.position)
      formDataApi.append('font_name', formData.fontName)
      formDataApi.append('font_size', formData.fontSize)
      formDataApi.append('margin', formData.margin)
      formDataApi.append('redact_keywords', formData.redactKeywords)
      formDataApi.append('redact_fill_label', formData.redactFillLabel)
      formDataApi.append('redact_pii_regex', formData.redactPiiRegex)
      formDataApi.append('redaction_boxes', '[]')

      const response = await fetch(`${API_URL ? API_URL : ''}/api/process-pdf`, {
        method: 'POST',
        body: formDataApi,
      })

      setProgress(50)

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Processing failed')
      }

      setProgress(90)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const redactionsApplied = response.headers.get('X-Redactions-Applied')
      const pagesProcessed = response.headers.get('X-Pages-Processed')

      setResult({
        url,
        filename: file.name.replace('.pdf', '_processed.pdf'),
        redactionsApplied: parseInt(redactionsApplied) || 0,
        pagesProcessed: parseInt(pagesProcessed) || 0,
      })

      setProgress(100)
    } catch (err) {
      setError(err.message || 'An error occurred during processing')
    } finally {
      setProcessing(false)
    }
  }

  const downloadResult = () => {
    if (result?.url) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(result.url)
    }
  }

  const resetTool = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const copyResultInfo = () => {
    if (result) {
      const info = `Processed: ${result.filename}\nPages: ${result.pagesProcessed}\nRedactions: ${result.redactionsApplied}`
      navigator.clipboard.writeText(info)
    }
  }

  // SEO Helmet
  const pageTitle = document.title

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="w-full">
        {/* Hero / Tool Section - Above the Fold */}
        <section className="relative px-4 py-12 sm:py-16 lg:py-20 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="section-heading">Bates Stamp & Permanently Redact PDFs</h1>
              <p className="section-subheading">
                Professional legal document processing in your browser. Zero server retention. No signup. Free forever.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Upload & Controls */}
              <div className="space-y-6">
                {/* Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActiveRef.current
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-300 hover:border-primary-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  aria-label="Drop zone for PDF files"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    aria-label="Choose PDF file"
                    disabled={processing}
                  />
                  <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" aria-hidden="true" />
                  <p className="text-lg font-medium text-neutral-900 mb-1">
                    {file ? `Selected: ${file.name}` : 'Drag & drop a PDF file here'}
                  </p>
                  <p className="text-neutral-500 text-sm mb-4">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process`
                      : 'Up to 50MB • No server upload • Processed locally'}
                  </p>
                  {file && (
                    <button
                      onClick={resetTool}
                      className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1 mx-auto"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove file
                    </button>
                  )}
                </div>

                {/* Live Bates Preview */}
                {formData.enableBates && (
                  <div className="card animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary-700" aria-hidden="true" />
                        Live Bates Stamp Preview
                      </h3>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 font-mono text-lg text-center min-h-[80px] flex items-center justify-center">
                      {batesPreview ? (
                        <span className="text-primary-700 font-medium tracking-wider">{batesPreview}</span>
                      ) : (
                        <span className="text-neutral-400">Enable Bates stamping to see preview</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-3 text-center">
                      Format: {formData.prefix}{String(formData.startNum).padStart(formData.digits, '0')}{formData.suffix}
                    </p>
                  </div>
                )}

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                  <Shield className="h-5 w-5 text-green-700 flex-shrink-0" aria-hidden="true" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">Zero Server Retention</p>
                    <p className="text-sm text-green-700">Files processed in volatile browser RAM. Purged immediately after download.</p>
                  </div>
                </div>

                {/* Process Button */}
                <button
                  onClick={processPDF}
                  disabled={processing || !file}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Processing... {progress}%
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" aria-hidden="true" />
                      Process PDF
                    </>
                  )}
                </button>
              </div>

              {/* Settings Panel */}
              <div className="space-y-6">
                <div className="card sticky top-24 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary-700" aria-hidden="true" />
                      Processing Options
                    </h2>
                  </div>

                  {/* Bates Stamping Toggle */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enableBates}
                        onChange={(e) => handleInputChange('enableBates', e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-500"
                      />
                      <span className="font-medium text-neutral-900">Enable Bates Numbering</span>
                    </label>

                    {formData.enableBates && (
                      <div className="space-y-4 pl-7 border-l-2 border-neutral-200">
                        {/* Prefix, Start, Digits, Suffix Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="label-text" htmlFor="prefix">Prefix</label>
                            <input
                              id="prefix"
                              type="text"
                              value={formData.prefix}
                              onChange={(e) => handleInputChange('prefix', e.target.value)}
                              className="input-field font-mono"
                              placeholder="CASE-"
                              maxLength={20}
                            />
                          </div>
                          <div>
                            <label className="label-text" htmlFor="suffix">Suffix (optional)</label>
                            <input
                              id="suffix"
                              type="text"
                              value={formData.suffix}
                              onChange={(e) => handleInputChange('suffix', e.target.value)}
                              className="input-field font-mono"
                              placeholder=""
                              maxLength={20}
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="label-text" htmlFor="startNum">Start Number</label>
                            <div className="flex items-stretch gap-2">
                              <button
                                type="button"
                                onClick={() => handleNumberChange('startNum', -1)}
                                className="btn-number-control w-12 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease start number"
                              >
                                <Minus className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <input
                                id="startNum"
                                type="number"
                                value={formData.startNum}
                                onChange={(e) => handleInputChange('startNum', parseInt(e.target.value) || 1)}
                                className="input-field flex-1 text-center font-mono"
                                min="1"
                                max="99999999"
                              />
                              <button
                                type="button"
                                onClick={() => handleNumberChange('startNum', 1)}
                                className="btn-number-control w-12 flex items-center justify-center hover:bg-neutral-100"
                                aria-label="Increase start number"
                              >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="label-text" htmlFor="digits">Zero Padding (3-8)</label>
                            <div className="flex items-stretch gap-2">
                              <button
                                type="button"
                                onClick={() => handleNumberChange('digits', -1)}
                                className="btn-number-control w-12 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease digits"
                                disabled={formData.digits <= 3}
                              >
                                <Minus className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <input
                                id="digits"
                                type="number"
                                value={formData.digits}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value)
                                  if (val >= 3 && val <= 8) handleInputChange('digits', val)
                                }}
                                className="input-field flex-1 text-center font-mono"
                                min="3"
                                max="8"
                              />
                              <button
                                type="button"
                                onClick={() => handleNumberChange('digits', 1)}
                                className="btn-number-control w-12 flex items-center justify-center hover:bg-neutral-100"
                                aria-label="Increase digits"
                                disabled={formData.digits >= 8}
                              >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Position & Font */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="label-text" htmlFor="position">Position</label>
                            <select
                              id="position"
                              value={formData.position}
                              onChange={(e) => handleInputChange('position', e.target.value)}
                              className="input-field"
                            >
                              {positionOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="label-text" htmlFor="fontName">Font</label>
                            <select
                              id="fontName"
                              value={formData.fontName}
                              onChange={(e) => handleInputChange('fontName', e.target.value)}
                              className="input-field"
                            >
                              {fontOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="label-text" htmlFor="fontSize">Font Size (6-24pt)</label>
                            <input
                              id="fontSize"
                              type="number"
                              value={formData.fontSize}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value)
                                if (val >= 6 && val <= 24) handleInputChange('fontSize', val)
                              }}
                              className="input-field"
                              min="6"
                              max="24"
                              step="0.5"
                            />
                          </div>
                          <div>
                            <label className="label-text" htmlFor="margin">Margin (pt)</label>
                            <input
                              id="margin"
                              type="number"
                              value={formData.margin}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value)
                                if (val >= 0) handleInputChange('margin', val)
                              }}
                              className="input-field"
                              min="0"
                              max="144"
                              step="1"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Redaction Section */}
                    <div className="pt-6 border-t border-neutral-200">
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input
                          type="checkbox"
                          checked={formData.redactPiiRegex}
                          onChange={(e) => handleInputChange('redactPiiRegex', e.target.checked)}
                          className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-500"
                        />
                        <span className="font-medium text-neutral-900">Auto-Redact PII (SSN, ID, Email)</span>
                      </label>

                      <div className="space-y-4">
                        <div>
                          <label className="label-text" htmlFor="redactKeywords">Keywords to Redact (comma-separated)</label>
                          <textarea
                            id="redactKeywords"
                            value={formData.redactKeywords}
                            onChange={(e) => handleInputChange('redactKeywords', e.target.value)}
                            className="input-field min-h-[80px] font-mono text-sm"
                            placeholder="confidential, privilege, SSN, account number..."
                            rows={3}
                          />
                          <p className="text-xs text-neutral-500 mt-1">Each keyword will be permanently redacted on all pages</p>
                        </div>

                        <div>
                          <label className="label-text" htmlFor="redactFillLabel">Redaction Overlay Label</label>
                          <input
                            id="redactFillLabel"
                            type="text"
                            value={formData.redactFillLabel}
                            onChange={(e) => handleInputChange('redactFillLabel', e.target.value)}
                            className="input-field font-mono"
                            placeholder="REDACTED"
                            maxLength={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot />

        {/* Results Section */}
        {result && (
          <section className="px-4 py-12 bg-neutral-50 animate-fade-in">
            <div className="mx-auto max-w-7xl">
              <div className="card max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">Processing Complete</h2>
                    <p className="text-neutral-600">{result.filename}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm text-neutral-500">Pages Processed</p>
                    <p className="text-2xl font-bold text-neutral-900 font-mono">{result.pagesProcessed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Redactions Applied</p>
                    <p className="text-2xl font-bold text-neutral-900 font-mono">{result.redactionsApplied}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadResult}
                    className="btn-primary flex-1 sm:flex-none"
                  >
                    <Download className="h-5 w-5" aria-hidden="true" />
                    Download Processed PDF
                  </button>
                  <button
                    onClick={copyResultInfo}
                    className="btn-secondary flex-1 sm:flex-none"
                  >
                    <Copy className="h-5 w-5" aria-hidden="true" />
                    Copy Info
                  </button>
                  <button
                    onClick={resetTool}
                    className="btn-secondary flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                    Process Another
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error Section */}
        {error && (
          <section className="px-4 py-8 animate-fade-in">
            <div className="mx-auto max-w-7xl">
              <div className="card max-w-2xl mx-auto border-red-200 bg-red-50">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-red-900">Processing Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="px-4 py-16 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="section-heading">Built for Legal Professionals</h2>
              <p className="section-subheading">
                Every feature designed for real legal workflows — from solo practice to big law.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 mb-4">
                  <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Bates Numbering</h3>
                <p className="text-neutral-600 text-sm">Custom prefixes, zero-padding 3-8 digits, 5 positions, 3 fonts</p>
              </div>
              <div className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 mb-4">
                  <Shield className="h-5 w-5 text-green-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Permanent Redaction</h3>
                <p className="text-neutral-600 text-sm">Text-layer destruction via PyMuPDF apply_redactions()</p>
              </div>
              <div className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 mb-4">
                  <Lock className="h-5 w-5 text-purple-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Auto PII Detection</h3>
                <p className="text-neutral-600 text-sm">SSN, 12-digit IDs, emails — regex-powered</p>
              </div>
              <div className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 mb-4">
                  <Brain className="h-5 w-5 text-orange-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Zero Retention</h3>
                <p className="text-neutral-600 text-sm">Client-side processing, no server uploads</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot />

        {/* Use Cases */}
        <section className="px-4 py-16 bg-neutral-50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="section-heading">Common Legal Workflows</h2>
              <p className="section-subheading">
                Pre-configured tools for your specific practice area.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Court Exhibits', path: '/bates-stamp-court-exhibits', desc: 'EXHIBIT-A- prefix, top-right, Times-Roman 11pt' },
                { title: 'Discovery Productions', path: '/bates-number-discovery-documents', desc: 'PROD- prefix, 7 digits, high-volume ready' },
                { title: 'Redact SSN & PII', path: '/redact-ssn-from-pdf', desc: 'Auto-detect SSN, Aadhaar, emails' },
                { title: 'Confidential Stamps', path: '/confidential-stamp-pdf', desc: 'CONFIDENTIAL- bottom-center, Courier 14pt' },
                { title: 'Financial Redaction', path: '/redact-bank-account-numbers-pdf', desc: 'Account, routing, SWIFT, IBAN keywords' },
                { title: 'HIPAA Medical Records', path: '/medical-records-hipaa-pdf-redaction', desc: 'PHI Safe Harbor 18 identifiers' },
                { title: 'Paralegal Exhibit Gen', path: '/law-firm-pdf-exhibit-generator', desc: 'Case prefixes, batch export, manifests' },
              ].map((tool) => (
                <a
                  key={tool.path}
                  href={tool.path}
                  className="card hover:shadow-card-hover transition-shadow group"
                >
                  <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{tool.desc}</p>
                  <span className="text-sm font-medium text-primary-700 flex items-center gap-1">
                    Open Tool
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}