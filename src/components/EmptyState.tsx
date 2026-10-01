import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { riseVariants } from './motion'

type EmptyStateProps = {
  emoji?: string
  title: string
  hint?: string
  action?: { label: string; to: string }
}

/** 🐿 nothing here (yet) */
export function EmptyState({ emoji = '🐿', title, hint, action }: EmptyStateProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={riseVariants}
      initial={reduced ? false : 'initial'}
      animate="animate"
      className="note-dash flex flex-col items-center gap-3 rounded-card px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="text-5xl motion-safe:animate-bounce"
        style={{ animationDuration: '2.4s' }}
      >
        {emoji}
      </span>
      <p className="font-display text-xl text-ink-900">{title}</p>
      {hint ? <p className="max-w-sm text-sm text-ink-500">{hint}</p> : null}
      {action ? (
        <Link
          to={action.to}
          className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-leaf-400 px-4 py-1.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {action.label}
        </Link>
      ) : null}
    </motion.div>
  )
}
