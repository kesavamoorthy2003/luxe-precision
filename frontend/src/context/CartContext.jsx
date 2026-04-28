import { createContext, useContext, useState, useEffect } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  // Load cart initially
  useEffect(() => {
    if (isLoggedIn) {
      // Load from backend
      fetchCart()
    } else {
      // Load from local storage
      const saved = localStorage.getItem('luxe_guest_cart')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setCartItems(parsed)
        } catch (e) {}
      }
    }
  }, [isLoggedIn])

  // Save guest cart whenever it changes
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('luxe_guest_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoggedIn])

  // Merge guest cart on login
  useEffect(() => {
    if (isLoggedIn) {
      const saved = localStorage.getItem('luxe_guest_cart')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.length > 0) {
            mergeGuestCart(parsed)
          } else {
            fetchCart()
          }
        } catch (e) {}
      } else {
        fetchCart()
      }
    }
  }, [isLoggedIn])

  // Recalculate totals
  useEffect(() => {
    let count = 0
    let total = 0
    cartItems.forEach(item => {
      count += item.quantity
      total += (item.product?.price || item.price || 0) * item.quantity
    })
    setCartCount(count)
    setCartTotal(total)
  }, [cartItems])

  const mergeGuestCart = async (guestCartItems) => {
    try {
      for (const item of guestCartItems) {
        const productId = item.productId || item.id
        await cartService.addToCart(productId, item.quantity)
      }
      localStorage.removeItem('luxe_guest_cart')
      fetchCart()
    } catch (error) {
      console.error('Error merging cart:', error)
      fetchCart()
    }
  }

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart()
      if (res.success) {
        setCartItems(res.data.items)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        const res = await cartService.addToCart(product.id, quantity)
        if (res.success) setCartItems(res.data.items)
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => (item.id === product.id || item.productId === product.id))
        if (existing) {
          return prev.map(item =>
            (item.id === product.id || item.productId === product.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...prev, { ...product, productId: product.id, product, quantity }]
      })
    }
  }

  // Remove from cart
  const removeFromCart = async (itemId) => { 
    if (isLoggedIn) {
      try {
        const res = await cartService.removeFromCart(itemId)
        if (res.success) setCartItems(res.data.items)
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId && item.productId !== itemId))
    }
  }

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId)
    
    if (isLoggedIn) {
      try {
        const res = await cartService.updateQuantity(itemId, quantity)
        if (res.success) setCartItems(res.data.items)
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    } else {
      setCartItems(prev =>
        prev.map(item =>
          (item.id === itemId || item.productId === itemId) ? { ...item, quantity } : item
        )
      )
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        const res = await cartService.clearCart()
        if (res.success) setCartItems([])
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    } else {
      setCartItems([])
    }
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}