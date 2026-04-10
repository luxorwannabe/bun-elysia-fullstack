import { useMemo } from 'react'

/**
 * Shared password strength hook used by Register and Profile.
 * Returns score (0-4), color class, and label.
 */
export function usePasswordStrength(password: string) {
  const score = useMemo(() => {
    let s = 0
    if (password.length > 5) s += 1
    if (password.length > 8) s += 1
    if (/\d/.test(password)) s += 1
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) s += 1
    return s
  }, [password])

  const color = useMemo(() => {
    switch (score) {
      case 0: return 'bg-slate-700'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-400'
      case 4: return 'bg-emerald-500'
      default: return 'bg-slate-700'
    }
  }, [score])

  const label = useMemo(() => {
    if (password.length === 0) return ''
    switch (score) {
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      default: return ''
    }
  }, [password.length, score])

  return { score, color, label }
}
