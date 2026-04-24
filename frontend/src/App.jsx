import './App.css'

import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from '@clerk/clerk-react'

import LoginPage from "./pages/LoginPage"
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import AddressesPage from './pages/AddressesPage'
import WishlistPage from './pages/WishlistPage'
import ProductDetailPage from './pages/ProductDetailPage'

import PageLoader from './components/PageLoader'
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <PageLoader />

  return (
    <Routes>
      <Route path='/login' element={isSignedIn ? <Navigate to={'/home'} /> : <LoginPage />} />
      <Route path='/' element={isSignedIn ? <DashboardLayout /> : <Navigate to={'/login'} />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      {/* No navbar on this page */}
      <Route path='/addresses' element={isSignedIn ? <AddressesPage /> : <Navigate to={'/login'} />} />
    </Routes>
  )
}

export default App
