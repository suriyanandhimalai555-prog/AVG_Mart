import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import ProductDetailView from './pages/ProductDetailView'
import AllProducts from './pages/AllProducts'
import TShirts from './pages/TShirts'
import Shoes from './pages/Shoes'
import Watches from './pages/Watches'
import Belts from './pages/Belt'
import About from './pages/About'
import MyOrders from './pages/MyOrders'
import OrderStatusDetail from './pages/OrderStatusDetail'
import Profile from './pages/Profile'

// Admin Panel Imports
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import AddProducts from './pages/admin/AddProducts'
import CustomerOrders from './pages/admin/CustomerOrders'

const App = () => {
  return (
    <div>
      <Routes>
        {/* --- CLIENT STOREFRONT ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />

        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/cart" element={<Cart />} />

        {/* Product Categories */}
        <Route path="/allproducts" element={<AllProducts />} />
        <Route path="/products/t-shirts" element={<TShirts />} />
        <Route path="/products/shoes" element={<Shoes />} />
        <Route path="/products/watches" element={<Watches />} />
        <Route path="/products/belts" element={<Belts />} />

        {/* User Account & Order Operations */}
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/track/:id" element={<OrderStatusDetail />} />
        <Route path="/profile" element={<Profile />} />

        {/* --- DYNAMIC RESPONSIVE ADMIN DASHBOARD MATRIX --- */}
        <Route 
          path="/admin/*" 
          element={
            <div className="flex flex-col lg:flex-row bg-royal-dark min-h-screen text-white antialiased">
              {/* Responsive Sidebar component */}
              <Sidebar />
              
              {/* Dynamic Sub-Routing View Panel */}
              <div className="flex-1 overflow-x-hidden bg-royal-dark/30">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<AddProducts />} />
                  <Route path="orders" element={<CustomerOrders />} />
                </Routes>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  )
}

export default App