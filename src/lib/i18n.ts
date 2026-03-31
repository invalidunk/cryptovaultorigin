import { useTranslation } from 'react-i18next'

export function useAppT() {
  const { t } = useTranslation()

  const tr = (key: string, fallback?: string) => {
    const value = t(key)
    if (!value || value === key) {
      return fallback ?? key
    }
    return value
  }

  return { tr }
}
