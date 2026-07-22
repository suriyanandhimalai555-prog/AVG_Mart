import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop' 

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import ProductDetailView from './pages/ProductDetailView'
import AllProducts from './pages/AllProducts'

// DYNAMIC GENERIC HANDLER REPLACEMENT
import CategoryViewPage from './pages/CategoryViewPage'

import About from './pages/About'
import MyOrders from './pages/MyOrders'
import OrderStatusDetail from './pages/OrderStatusDetail'
import Profile from './pages/Profile'

// Admin Panel Imports
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import AddProducts from './pages/admin/AddProducts'
import CustomerOrders from './pages/admin/CustomerOrders'
import AddCategory from './pages/admin/AddCategory'
import RequestStockBranch from './pages/admin/RequestStockBranch'

// Route Protection Guards
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoutes'
import Checkout from './pages/Checkout'

// Branch Admin Imports
import BranchSidebar from './pages/branchAdmin/BranchSidebar'
import BranchAdmin from './pages/branchAdmin/BranchAdmin'
import BranchOrders from './pages/branchAdmin/BranchOrders'
import BranchAdminDashboard from './pages/branchAdmin/BranchAdminDashboard'
import Stock from './pages/branchAdmin/Stock'
import RequestStock from './pages/branchAdmin/RequestStock'
import BranchProfile from './pages/branchAdmin/BranchProfile'

// Seller Imports
import SellerLogin from './pages/seller/SellerLogin'
import SellerRegister from './pages/seller/SellerRegister'
import SellerSidebar from './pages/seller/SellerSidebar'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProfile from './pages/seller/SellerProfile'

const App = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-lime-accent selection:text-royal-dark">
      <ScrollToTop />
      
      <Routes>
        {/* PUBLIC UNPROTECTED ASSETS ROUTING MATRIX */}
        <Route path="/" element={<Home />} />
        <Route path="/allproducts" element={<AllProducts />} />
        
        {/* --- THE MASTER DYNAMIC CATEGORY ROUTE --- */}
        <Route path="/products/:categoryName" element={<CategoryViewPage />} />
        
        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/about" element={<About />} />

        {/* AUTH BLOCKING ENTRY CHANNELS */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
        </Route>

        {/* SECURED SELLER ENTRY CHANNEL */}
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route
            path="/seller/*"
            element={
              <div className="flex flex-col lg:flex-row min-h-screen text-white antialiased">
                <SellerSidebar />
                <div className="flex-1 overflow-x-hidden bg-[#0A224E] backdrop-blur-md p-6 lg:p-10">
                  <Routes>  
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<SellerDashboard />} />
                    <Route path="profile" element={<SellerProfile />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>

        {/* SECURED CLIENT APPLICATION ROLES PRIVILEGES ENTRY CHANNEL */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/track/:id" element={<OrderStatusDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* SECURED PLATFORM ROOT SYSTEM MASTER ROLES */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route
            path="/admin/*"
            element={
              <div className="flex flex-col lg:flex-row bg-royal-dark min-h-screen text-white antialiased">
                <Sidebar />
                <div className="flex-1 overflow-x-hidden bg-white/[0.01] backdrop-blur-md p-4 sm:p-6 lg:p-10">
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="categories" element={<AddCategory />} />
                    <Route path="products" element={<AddProducts />} />
                    <Route path="category" element={<AddCategory />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="create-branch-admin" element={<BranchAdmin />} />
                    <Route path='stock-request' element={<RequestStockBranch />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>

        {/* SECURED BRANCH ADMIN ENTRY POINT */}
        <Route element={<ProtectedRoute requiredRole="branch_admin" />}>
          <Route
            path="/branch-admin/*"
            element={
              <div className="flex flex-col lg:flex-row bg-[#071640] min-h-screen text-white antialiased">
                <BranchSidebar />
                <div className="flex-1 overflow-x-hidden bg-white/[0.02] backdrop-blur-md p-6 lg:p-10">
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<BranchAdminDashboard />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="orders" element={<BranchOrders />} />
                    <Route path='request-stock' element={<RequestStock />} />
                    <Route path="profile" element={<BranchProfile />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App