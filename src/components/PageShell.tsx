import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { pageVariants } from './motion'

type PageShellProps = {
  children: ReactNode
}

/** every page sits in one of these, so route changes can cross-fade */
export function PageShell({ children }: PageShellProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={pageVariants}
      initial={reduced ? false : 'initial'}
      animate="animate"
      exit={reduced ? undefined : 'exit'}
    >
      {children}
    </motion.div>
  )
}
