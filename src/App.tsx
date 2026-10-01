import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'
import { LoadingState } from './components/LoadingState'
import './styles/site.css'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const SkillsPage = lazy(() => import('@/pages/SkillsPage').then((m) => ({ default: m.SkillsPage })))
const CategoryPage = lazy(() => import('@/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const SkillDetailPage = lazy(() =>
  import('@/pages/SkillDetailPage').then((m) => ({ default: m.SkillDetailPage })),
)
const ChangelogPage = lazy(() => import('@/pages/ChangelogPage').then((m) => ({ default: m.ChangelogPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const NotFoundPage = lazy(() => import('@/components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function App() {
  const location = useLocation()

  return (
    <Layout>
      <Suspense fallback={<LoadingState />}>
        <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/skill/:id" element={<SkillDetailPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      </Suspense>
    </Layout>
  )
}

export default App
