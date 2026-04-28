import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]         = useState('signin') // 'signin' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'signin') {
        await login(form.email, form.password)
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await register(form.name, form.email, form.phone, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-xl flex">

        {/* ── Left: Image Panel ── */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#0a0a0f] flex-col justify-between p-10">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"
            alt="Luxe"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

          {/* Logo */}
          <div className="relative z-10">
            <span className="text-white font-extrabold text-xl tracking-tight">
              LUXE<span className="text-[#2B3FE7]">.</span>
            </span>
          </div>

          {/* Quote */}
          <div className="relative z-10">
            <h2 className="text-white text-3xl font-black leading-tight mb-3"
              style={{ fontFamily: "'Georgia', serif" }}>
              The Curated<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B3FE7] to-purple-400">
                Precision.
              </span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Enter the digital boutique. Where high-fashion curation meets technological elegance.
            </p>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          {/* Tabs */}
          <div className="flex gap-6 mb-8">
            <button
              onClick={() => { setTab('signin'); setError('') }}
              className={`text-xl font-black transition-colors
                ${tab === 'signin' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError('') }}
              className={`text-xl font-black transition-colors
                ${tab === 'register' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">

            {/* Name — only register */}
            {tab === 'register' && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    outline-none focus:border-[#2B3FE7] transition-colors"
                />
              </div>
            )}

            {/* Phone — only register */}
            {tab === 'register' && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    outline-none focus:border-[#2B3FE7] transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                  outline-none focus:border-[#2B3FE7] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  Password
                </label>
                {tab === 'signin' && (
                  <button className="text-xs text-[#2B3FE7] hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                  outline-none focus:border-[#2B3FE7] transition-colors"
              />
            </div>

            {/* Confirm Password — only register */}
            {tab === 'register' && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    outline-none focus:border-[#2B3FE7] transition-colors"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-500 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#2B3FE7] text-white font-bold text-sm
                tracking-widest uppercase rounded-full hover:bg-blue-700
                transition-all hover:shadow-[0_0_30px_rgba(43,63,231,0.4)]
                disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? 'Please wait...'
                : tab === 'signin' ? 'Access Account' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-[1px] bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border
                border-gray-200 rounded-full text-sm font-semibold text-gray-700
                hover:border-gray-300 hover:bg-gray-50 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border
                border-gray-200 rounded-full text-sm font-semibold text-gray-700
                hover:border-gray-300 hover:bg-gray-50 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}