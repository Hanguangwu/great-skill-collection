import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { PageShell } from './PageShell'
import { riseVariants } from './motion'

/** 🏝 404 — a small island that isn't on the map */
export function NotFoundPage() {
  const reduced = useReducedMotion()

  return (
    <PageShell>
      <motion.section
        variants={riseVariants}
        initial={reduced ? false : 'initial'}
        animate="animate"
        className="mx-auto flex max-w-lg flex-col items-center py-10 text-center"
      >
        <motion.div
          aria-hidden="true"
          className="relative"
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="grid size-28 place-items-center rounded-card border-2 border-wood-400 bg-sand-50 text-6xl shadow-pop">
            🏝
          </div>
          <div className="absolute inset-x-2 -bottom-3 h-4 rounded-full border-2 border-wood-500/50 bg-ocean-300" />
        </motion.div>

        <p className="stamp mt-8 px-3 py-0.5 font-display text-2xl text-coral-500">404</p>
        <h1 className="mt-3 font-display text-3xl text-ink-900">这座岛上没有这条路</h1>
        <p className="mt-2 text-sm text-ink-500">
          要么这个页面还没建起来，要么地址被海风吹错了。回主岛看看吧。
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-leaf-400 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            🏝 回首页
          </Link>
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-sand-50 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            🗂 打开 Skill 图鉴
          </Link>
        </div>
      </motion.section>
    </PageShell>
  )
}
