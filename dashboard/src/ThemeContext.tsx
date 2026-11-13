import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thesis-theme')
      if (saved === 'dark' || saved === 'light') return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.body.className = theme
    localStorage.setItem('thesis-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export const THEME_COLORS = {
  light: { accent: '#0052D4', green: '#0A8754', purple: '#6B4CE6', red: '#C62828', yellow: '#D4A017', grid: 'rgba(0,0,0,0.05)', axis: '#aaa' },
  dark: { accent: '#5B9DF5', green: '#4ADE80', purple: '#A78BFA', red: '#F87171', yellow: '#FFBD12', grid: 'rgba(255,255,255,0.04)', axis: '#555' },
} as const
