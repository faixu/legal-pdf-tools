import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import PDFTool from './components/PDFTool'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import Terms from './pages/legal/Terms'
import About from './pages/legal/About'
import Contact from './pages/legal/Contact'
import GuidesHub from './pages/guides/GuidesHub'
import GuideArticle from './pages/guides/GuideArticle'
import ToolsHub from './pages/tools/ToolsHub'
import ToolPage from './pages/tools/ToolPage'
import NotFound from './pages/NotFound'
import { seoPages, legalPages, guidePages } from './config/seoPages'

function App() {
  const allToolRoutes = Object.keys(seoPages)
  const allLegalRoutes = Object.keys(legalPages)
  const allGuideRoutes = Object.keys(guidePages)

  return (
    <HelmetProvider>
      <Routes>
        {/* Tools Hub */}
        <Route
          path="/tools"
          element={
            <Layout pageConfig={{ title: 'Legal Document Processing Tools', description: 'Free, professional-grade legal document processing tools for Bates stamping, PDF redaction, and compliance. Zero server retention, no signup required.' }}>
              <ToolsHub />
            </Layout>
          }
        />

        {/* Individual Tool Pages */}
        <Route
          path="/tools/:slug"
          element={
            <Layout pageConfig={{ title: 'Legal Document Processing Tool', description: 'Free legal document processing tool.' }}>
              <ToolPage />
            </Layout>
          }
        />

        {/* Tool routes with dynamic SEO (legacy direct routes) */}
        {allToolRoutes.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Layout pageConfig={seoPages[path]}>
                <PDFTool preset={seoPages[path].preset} />
              </Layout>
            }
          />
        ))}

        {/* Legal pages */}
        {allLegalRoutes.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Layout pageConfig={legalPages[path]}>
                {path === '/privacy-policy' && <PrivacyPolicy />}
                {path === '/terms' && <Terms />}
                {path === '/about' && <About />}
                {path === '/contact' && <Contact />}
                {path === '/guides' && <GuidesHub />}
              </Layout>
            }
          />
        ))}

        {/* Guide articles */}
        {allGuideRoutes.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Layout pageConfig={guidePages[path]}>
                <GuideArticle slug={path} />
              </Layout>
            }
          />
        ))}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  )
}

export default App