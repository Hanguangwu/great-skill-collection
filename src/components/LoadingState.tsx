import { motion, useReducedMotion } from 'framer-motion'

type LoadingStateProps = {
  /** how many skeleton cards to fake */
  cards?: number
}

/** 🐻 正在整理 Skill 收藏册… */
export function LoadingState({ cards = 6 }: LoadingStateProps) {
  const reduced = useReducedMotion()

  return (
    <div role="status" aria-live="polite">
      <p className="mb-5 flex items-center gap-2 text-sm font-bold text-ink-700">
        <motion.span
          aria-hidden="true"
          className="text-xl"
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          🐻
        </motion.span>
        正在整理 Skill 收藏册…
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className="rounded-card border-2 border-sand-300 bg-sand-100 p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 shrink-0 animate-pulse rounded-2xl bg-sand-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-sand-200" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-sand-200/80" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-sand-200" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-sand-200" />
            </div>
            <div className="mt-5 flex gap-2">
              <div className="h-5 w-14 animate-pulse rounded-full bg-sand-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-sand-200" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">正在整理 Skill 收藏册</span>
    </div>
  )
}
