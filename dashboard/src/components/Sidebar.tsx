import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'

interface SidebarProps {
  sections: { id: string; label: string; icon: string }[]
  activeSection: string
  onNavigate: (id: string) => void
  onStartTour: () => void
}

export function Sidebar({ sections, activeSection, onNavigate, onStartTour }: SidebarProps) {
  const { theme, toggle } = useTheme()

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 md:w-56 flex flex-col z-40 border-r"
      style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper)' }}
    >
      {/* Logo */}
      <div className="p-4 md:px-5 md:py-6 border-b" style={{ borderColor: 'var(--color-rule)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'var(--color-accent)' }}
          >
            N
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-ink)' }}>
              NEAR Thesis
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
              AI Settlement Layer
            </p>
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2" id="tour-nav">
        {sections.map((s, i) => {
          const isActive = activeSection === s.id
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer group relative"
              style={{
                background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-ink-soft)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: 'var(--color-accent)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="text-sm w-5 text-center shrink-0">{s.icon}</span>
              <div className="hidden md:block min-w-0">
                <span className="text-[10px] font-mono block" style={{ color: 'var(--color-ink-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-medium block truncate">{s.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom controls */}
      <div className="p-3 space-y-2 border-t" style={{ borderColor: 'var(--color-rule)' }}>
        <button
          onClick={onStartTour}
          className="w-full flex items-center justify-center md:justify-start gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer hover:opacity-80"
          style={{ color: '#fff', background: 'var(--color-accent)' }}
          id="tour-help"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span className="hidden md:inline font-medium">Guided tour</span>
        </button>

        <button
          onClick={toggle}
          className="w-full flex items-center justify-center md:justify-start gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          style={{ color: 'var(--color-ink-muted)' }}
          id="tour-theme"
        >
          <span>{theme === 'light' ? '☾' : '☀'}</span>
          <span className="hidden md:inline">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>
      </div>
    </nav>
  )
}
