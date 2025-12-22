export type ThemeMode = 'dark' | 'light' | 'custom'

export interface ThemeColors {
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentSecondary: string
  border: string
  glass: string
}

const themes: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    bgPrimary: '#0a0a0f',
    bgSecondary: '#12121a',
    bgTertiary: '#1a1a2e',
    textPrimary: '#ffffff',
    textSecondary: '#8888a0',
    accent: '#e94560',
    accentSecondary: '#6c63ff',
    border: 'rgba(255, 255, 255, 0.08)',
    glass: 'rgba(255, 255, 255, 0.03)'
  },
  light: {
    bgPrimary: '#f8f9fa',
    bgSecondary: '#ffffff',
    bgTertiary: '#e9ecef',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#e94560',
    accentSecondary: '#6c63ff',
    border: 'rgba(0, 0, 0, 0.08)',
    glass: 'rgba(0, 0, 0, 0.02)'
  }
}

export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => 'dark')
  const customColors = useState<ThemeColors>('custom-colors', () => ({ ...themes.dark }))

  // Get current theme colors
  const colors = computed<ThemeColors>(() => {
    if (mode.value === 'custom') return customColors.value
    return themes[mode.value]
  })

  // Apply theme to CSS variables
  const applyTheme = () => {
    if (!import.meta.client) return
    
    const root = document.documentElement
    const c = colors.value
    
    root.style.setProperty('--bg-primary', c.bgPrimary)
    root.style.setProperty('--bg-secondary', c.bgSecondary)
    root.style.setProperty('--bg-tertiary', c.bgTertiary)
    root.style.setProperty('--text-primary', c.textPrimary)
    root.style.setProperty('--text-secondary', c.textSecondary)
    root.style.setProperty('--accent', c.accent)
    root.style.setProperty('--accent-secondary', c.accentSecondary)
    root.style.setProperty('--border-color', c.border)
    root.style.setProperty('--glass-bg', c.glass)
    
    // Store preference
    localStorage.setItem('pixel-party-theme', mode.value)
  }

  // Toggle between dark and light
  const toggleTheme = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  // Set specific theme
  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode
    applyTheme()
  }

  // Set custom color
  const setCustomColor = (key: keyof ThemeColors, value: string) => {
    customColors.value = { ...customColors.value, [key]: value }
    if (mode.value === 'custom') applyTheme()
  }

  // Initialize from localStorage
  const initTheme = () => {
    if (!import.meta.client) return
    
    const saved = localStorage.getItem('pixel-party-theme') as ThemeMode | null
    if (saved && (saved === 'dark' || saved === 'light' || saved === 'custom')) {
      mode.value = saved
    }
    applyTheme()
  }

  // Watch for mode changes
  watch(mode, () => {
    applyTheme()
  })

  onMounted(() => {
    initTheme()
  })

  return {
    mode,
    colors,
    toggleTheme,
    setTheme,
    setCustomColor,
    applyTheme
  }
}
