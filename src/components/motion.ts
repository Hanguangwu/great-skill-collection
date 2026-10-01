import type { Transition, Variants } from 'framer-motion'

export const softEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
export const springy: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 30,
  mass: 0.7,
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: softEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

export const staggerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.975 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: softEase },
  },
}

export const riseVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: softEase },
  },
}

/** hero notice board — a slow, gentle bob */
export const bobLoop: Transition = {
  duration: 5.6,
  repeat: Infinity,
  ease: 'easeInOut',
}
