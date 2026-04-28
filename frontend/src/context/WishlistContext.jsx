import { createContext, useContext, useState, useEffect } from 'react'
import { wishlistService } from '../services/wishlistService'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist on mount or auth change
  useEffect(() => {
    let mounted = true
    if (isLoggedIn) {
      setLoading(true)
      wishlistService.getWishlist()
        .then(res => {
          if (mounted && res.success) {
            setWishlistItems(res.data)
          }
        })
        .catch(console.error)
        .finally(() => {
          if (mounted) setLoading(false)
        })
    } else {
      setWishlistItems([]) // clear when logged out
    }
    return () => { mounted = false }
  }, [isLoggedIn])

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) return false // Or prompt to login
    try {
      const res = await wishlistService.toggleWishlist(productId)
      if (res.success) {
        if (res.wished) {
          // It was added. We need to fetch the full item or at least push a placeholder.
          // Simplest is to re-fetch the wishlist to get product details, or just get it.
          const fresh = await wishlistService.getWishlist()
          if (fresh.success) setWishlistItems(fresh.data)
        } else {
          // It was removed
          setWishlistItems(prev => prev.filter(item => item.productId !== productId))
        }
        return res.wished
      }
    } catch (e) {
      console.error(e)
    }
    return null
  }

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) return
    try {
      const res = await wishlistService.removeFromWishlist(productId)
      if (res.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const isWished = (productId) => wishlistItems.some(item => item.productId === productId)

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loading,
      toggleWishlist,
      removeFromWishlist,
      isWished
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
