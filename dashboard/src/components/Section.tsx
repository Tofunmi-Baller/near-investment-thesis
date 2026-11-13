import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  number: string
  title: string
  subtitle?: string
  children: ReactNode
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export function Section({ id, number, title, subtitle, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className="min-h-screen py-16 md:py-24 px-6 md:px-12 lg:px-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-10 md:mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] font-mono tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: 'var(--color-accent)', background: 'var(--color-accent-soft)' }}
          >
            {number}
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-rule)' }} />
        </div>

        <h2
          className="text-3xl md:text-5xl font-normal leading-[1.1] tracking-tight max-w-2xl"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="mt-4 text-base md:text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        {children}
      </motion.div>
    </motion.section>
  )
}

export function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  )
}
