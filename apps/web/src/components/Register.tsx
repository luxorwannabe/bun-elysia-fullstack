import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export const Register: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  useEffect(() => {
    document.title = 'Register | Bun Elysia Fullstack'
  }, [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password Strength Logic
  const getPasswordStrength = () => {
    let score = 0
    if (password.length > 5) score += 1
    if (password.length > 8) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) score += 1
    return score
  }

  const strengthScore = getPasswordStrength()
  
  const getStrengthColor = () => {
    switch (strengthScore) {
      case 0: return 'bg-slate-700'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-400'
      case 4: return 'bg-emerald-500'
      default: return 'bg-slate-700'
    }
  }

  const getStrengthLabel = () => {
    if (password.length === 0) return ''
    switch (strengthScore) {
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      default: return ''
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: apiError } = await api.auth.register.post({
      name,
      email,
      password,
    })

    setLoading(false)

    if (apiError) {
      const errVal = apiError.value as { error?: string; message?: string }
      setError(errVal?.error || errVal?.message || 'Registration failed')
      return
    }

    if (data) {
      onRegister()
    }
  }

  return (
    <div className="max-w-md w-full p-8 bg-slate-800 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
        <p className="text-slate-400 font-medium">Join Bun Elysia Auth today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="you@company.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-3 animate-in fade-in">
              <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
                <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 1 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 2 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 3 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 4 ? getStrengthColor() : 'bg-slate-700'}`}></div>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 text-right font-medium">
                {getStrengthLabel()}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium animate-pulse flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || password.length < 6}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 enabled:cursor-pointer disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-indigo-600/30 transform active:scale-[0.98] mt-2!"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm">
        <p className="text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
