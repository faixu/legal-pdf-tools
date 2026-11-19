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
import NotFound from './pages/NotFound'
import { seoPages, legalPages, guidePages } from './config/seoPages'

function App() {
  const allToolRoutes = Object.keys(seoPages)
  const allLegalRoutes = Object.keys(legalPages)
  const allGuideRoutes = Object.keys(guidePages)

  return (
    <HelmetProvider>
      <Routes>
        {/* Tool routes with dynamic SEO */}
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