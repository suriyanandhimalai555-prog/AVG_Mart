import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import ProductDetailView from './pages/ProductDetailView'

const App = () => {
  return (
    <div>
      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  )
}

export default App