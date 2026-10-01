import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDate, getAllSkills, siteMeta } from '@/lib/skills'
import { ScrollToTop } from './ScrollToTop'

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/skills', label: '图鉴', end: false },
  { to: '/category', label: '分类岛', end: false },
  { to: '/changelog', label: '更新日志', end: false },
  { to: '/about', label: '关于', end: false },
] as const

type NavListProps = { variant: 'desktop' | 'mobile' }

function NavList({ variant }: NavListProps) {
  return (
    <>
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors duration-200"
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <motion.span
                  layoutId={`nav-pill-${variant}`}
                  className="absolute inset-0 rounded-full border-2 border-leaf-500/60 bg-leaf-300/40"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span
                className={`relative transition-colors duration-200 ${
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </>
  )
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const skillCount = getAllSkills().length

  return (
    <div className="island-shell">
      <ScrollToTop />

      <header className="sticky top-0 z-40 border-b-2 border-wood-400 bg-sand-100 shadow-soft">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-2xl border-2 border-wood-400 bg-sand-50 text-xl shadow-soft transition-transform duration-200 group-hover:-rotate-6"
            >
              🏝
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg text-ink-900">Skill Island</span>
              <span className="hidden text-[11px] font-semibold text-ink-500 sm:block">
                My Open Agent Skills Collection
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="主导航">
            <NavList variant="desktop" />
          </nav>

          <a
            href={siteMeta.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            title="在 GitHub 上查看仓库"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink-900 bg-sand-50 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-[2px_2px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5 md:ml-2"
          >
            <GitHubMark />
            <span className="hidden lg:inline">GitHub</span>
          </a>
        </div>

        <nav
          className="no-scrollbar flex items-center gap-1 overflow-x-auto border-t border-dashed border-sand-300 px-4 py-1.5 md:hidden"
          aria-label="主导航"
        >
          <NavList variant="mobile" />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="relative mt-8 border-t-2 border-wood-400 bg-sand-200">
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute h-6 w-full text-sand-100"
          style={{ top: '-1px' }}
        >
          <path
            fill="currentColor"
            d="M0 40V14c60-10 120-10 180 0s120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0v26H0Z"
          />
        </svg>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-ink-900">🌱 Skill Island</p>
            <p className="mt-1 max-w-xs text-sm text-ink-500">{siteMeta.tagline}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-wood-500/70 bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
              Data source: SKILL.md
            </p>
          </div>

          <nav aria-label="页脚导航">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-500">岛上地图</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-ink-700 underline decoration-dashed decoration-1 underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-solid"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-500">小岛档案</p>
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="text-ink-500">岛主</dt>
                <dd className="font-bold text-ink-900">{siteMeta.owner}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-500">技能</dt>
                <dd className="font-bold text-ink-900">📦 {skillCount} 个</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-500">最后更新</dt>
                <dd className="font-bold text-ink-900">🕒 {formatDate(siteMeta.lastUpdated)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-500">仓库</dt>
                <dd>
                  <a
                    href={siteMeta.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 font-bold text-leaf-700 underline decoration-dashed underline-offset-4 hover:text-ink-900"
                  >
                    <GitHubMark />
                    查看
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </footer>
    </div>
  )
}
