export const useDarkMode = () => {
  const isDark = useState<boolean>('dark-mode', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('dark-mode')
      if (saved !== null) {
        return saved === 'true'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const toggle = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('dark-mode', String(isDark.value))
    }
  }

  const setDark = (value: boolean) => {
    isDark.value = value
    if (import.meta.client) {
      localStorage.setItem('dark-mode', String(value))
    }
  }

  if (import.meta.client) {
    watch(isDark, (newValue) => {
      document.documentElement.classList.toggle('dark', newValue)
    }, { immediate: true })
  }

  return {
    isDark,
    toggle,
    setDark
  }
}
