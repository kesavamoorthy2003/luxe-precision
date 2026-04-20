import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Page refresh ஆனாலும் login state maintain ஆகும்
    const saved = localStorage.getItem('luxe_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('luxe_token') || null
  })

  // ── Login ──────────────────────────────────────────
  const login = async (email, password) => {
    // ── இப்போ: Fake login (Frontend only) ──
    // Future-ல் இந்த block-ஐ மட்டும் மாத்தணும்:
    // const res = await axios.post('/api/auth/login', { email, password })
    // const { user, token } = res.data

    // Fake data — backend வந்தா இதை remove பண்ணுங்க
    if (!email || !password) throw new Error('Email and password required')
    if (password.length < 6) throw new Error('Invalid credentials')

    const fakeUser = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=2B3FE7&color=fff`,
      memberSince: '2024',
    }

    // Fake JWT token — backend வந்தா real token வரும்
    const fakeToken = btoa(JSON.stringify({ userId: 1, email, exp: Date.now() + 86400000 }))

    // Save to localStorage
    localStorage.setItem('luxe_user', JSON.stringify(fakeUser))
    localStorage.setItem('luxe_token', fakeToken)

    setUser(fakeUser)
    setToken(fakeToken)

    return fakeUser
  }

  // ── Register ───────────────────────────────────────
  const register = async (name, email, password) => {
    // Future: const res = await axios.post('/api/auth/register', { name, email, password })

    if (!name || !email || !password) throw new Error('All fields required')
    if (password.length < 6) throw new Error('Password must be 6+ characters')

    const fakeUser = {
      id: 1,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=2B3FE7&color=fff`,
      memberSince: '2024',
    }

    const fakeToken = btoa(JSON.stringify({ userId: 1, email, exp: Date.now() + 86400000 }))

    localStorage.setItem('luxe_user', JSON.stringify(fakeUser))
    localStorage.setItem('luxe_token', fakeToken)

    setUser(fakeUser)
    setToken(fakeToken)

    return fakeUser
  }

  // ── Logout ─────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('luxe_user')
    localStorage.removeItem('luxe_token')
    setUser(null)
    setToken(null)
  }

  const isLoggedIn = !!user && !!token

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isLoggedIn,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}