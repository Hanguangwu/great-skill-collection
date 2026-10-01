import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDate, getAllSkills, siteMeta } from '@/lib/skills'
import { bobLoop } from './motion'

type StatProps = {
  emoji: string
  label: string
  value: string
}

/** 📦 / 👤 / 🕒 挂在公告牌上的小木牌 */
function Stat({ emoji, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border-2 border-wood-500/40 bg-sand-100 px-3.5 py-2">
      <span aria-hidden="true" className="text-lg">
        {emoji}
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-ink-500">
          {label}
        </span>
        <span className="block text-sm font-bold text-ink-900">{value}</span>
      </span>
    </div>
  )
}

/** 🪧 the wooden notice board at the top of the island */
export function IslandHeader() {
  const reduced = useReducedMotion()
  const total = getAllSkills().length

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={bobLoop}
        className="relative rounded-card border-2 border-wood-500 bg-sand-300 p-3 shadow-pop sm:p-4"
      >
        {/* nails */}
        {[
          'left-3 top-3',
          'right-3 top-3',
          'bottom-3 left-3',
          'bottom-3 right-3',
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute ${pos} size-2.5 rounded-full bg-wood-500 shadow-[0_1px_0_rgba(255,255,255,0.5)]`}
          />
        ))}

        <div className="rounded-card border-2 border-dashed border-wood-500/50 bg-sand-50 px-5 py-8 text-center sm:px-10 sm:py-10">
          <p className="stamp mx-auto mb-4 inline-block px-3 py-0.5 text-[11px] font-bold tracking-widest text-wood-500">
            ISLAND NOTICE · 岛内公告
          </p>

          <h1 className="font-display text-4xl leading-none text-ink-900 sm:text-5xl">
            🌱 Skill Island
          </h1>
          <p className="mt-2 font-display text-lg text-leaf-700 sm:text-xl">
            {siteMeta.siteSubtitle}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">{siteMeta.tagline}</p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2.5">
            <Stat emoji="👤" label="Owner" value={siteMeta.owner} />
            <Stat emoji="📦" label="Skills" value={`${total} 个`} />
            <Stat emoji="🕒" label="Updated" value={formatDate(siteMeta.lastUpdated)} />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-leaf-400 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              🏝 逛逛 Skill 图鉴
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-sand-50 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              📖 Agent Skill 是什么
            </Link>
          </div>
        </div>

        {/* the shoreline */}
        <div
          aria-hidden="true"
          className="mt-3 h-4 overflow-hidden rounded-full border-2 border-wood-500/40 bg-ocean-300"
        >
          <div className="h-full w-full animate-[wave_6s_linear_infinite] bg-[repeating-linear-gradient(90deg,var(--color-ocean-400)_0_14px,transparent_14px_28px)] opacity-60" />
        </div>
      </motion.div>
    </motion.section>
  )
}
