import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  const navLinks = [
    { label: 'New Arrivals', path: '/products?category=new-arrivals' },
    { label: 'High Fashion', path: '/products?category=fashion' },
    { label: 'Electronics',  path: '/products?category=electronics' },
    { label: 'Editorial',    path: '/products' },
    { label: 'Collections',  path: '/products' },
  ]

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-[#2B3FE7] font-extrabold text-xl tracking-tight">
          LUXE PRECISION
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-sm text-gray-600 hover:text-[#2B3FE7] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Icons & User Auth */}
        <div className="flex items-center gap-5">
          
          {/* --- DYNAMIC PROFILE SECTION START --- */}
          {isLoggedIn ? (
            <div className="relative group">
              {/* User Avatar */}
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'} 
                alt={user?.name}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent
                  group-hover:border-[#2B3FE7] transition-all object-cover"
                onClick={() => navigate('/account/profile')}
              />
              
              {/* Dropdown Menu (Visible on Hover) */}
              <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100
                rounded-2xl shadow-xl py-2 opacity-0 group-hover:opacity-100
                pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                  <p className="text-[10px] text-gray-400">{user?.email}</p>
                </div>

                <button onClick={() => navigate('/account/profile')}
                  className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:text-[#2B3FE7] hover:bg-gray-50">
                  My Profile
                </button>

                <button onClick={() => navigate('/account/orders')}
                  className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:text-[#2B3FE7] hover:bg-gray-50">
                  Order History
                </button>

                <button onClick={() => { logout(); navigate('/') }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Login Icon (Visible when not logged in) */
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-[#2B3FE7] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            </button>
          )}
          {/* --- DYNAMIC PROFILE SECTION END --- */}

          {/* Wishlist Icon */}
          <button className="text-gray-600 hover:text-[#2B3FE7] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/cart')}
            className="relative text-gray-600 hover:text-[#2B3FE7] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2B3FE7] text-white text-[10px]
                font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-sm text-gray-700 hover:text-[#2B3FE7]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile Profile Link if logged in */}
          {isLoggedIn && (
            <Link to="/account/profile" className="text-sm text-[#2B3FE7] font-medium" onClick={() => setMenuOpen(false)}>
              My Profile ({user?.name})
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}