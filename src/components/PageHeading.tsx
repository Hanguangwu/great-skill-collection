import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { riseVariants } from './motion'

type PageHeadingProps = {
  emoji: string
  title: string
  description: string
  meta?: string
}

/** page-level title block: big tile + display heading + one line of context */
export function PageHeading({ emoji, title, description, meta }: PageHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={riseVariants}
      initial={reduced ? false : 'initial'}
      animate="animate"
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-card border-2 border-wood-400 bg-sand-50 text-3xl shadow-soft sm:size-16"
        >
          {emoji}
        </div>
        <div>
          <h1 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">{title}</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500 sm:text-base">{description}</p>
        </div>
      </div>
      {meta ? (
        <p className="stamp shrink-0 self-start px-3 py-1 text-xs font-bold text-ink-500 sm:self-auto">
          {meta}
        </p>
      ) : null}
    </motion.div>
  )
}

type SectionTitleProps = {
  emoji: string
  title: string
  hint?: string
  action?: { label: string; to: string }
}

/** section divider inside a page */
export function SectionTitle({ emoji, title, hint, action }: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl text-ink-900 sm:text-2xl">
          <span aria-hidden="true" className="mr-1.5">
            {emoji}
          </span>
          {title}
        </h2>
        {hint ? <p className="mt-0.5 text-sm text-ink-500">{hint}</p> : null}
      </div>
      {action ? (
        <Link
          to={action.to}
          className="shrink-0 text-sm font-bold text-leaf-700 underline decoration-dashed decoration-2 underline-offset-4 transition-colors hover:text-ink-900"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  )
}
