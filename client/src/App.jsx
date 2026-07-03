import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

// Route Protection Guards
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoutes'
import Checkout from './pages/Checkout'

// Branch Admin Imports
import BranchAdmin from './pages/branchAdmin/BranchAdmin'
import BranchSidebar from './pages/branchAdmin/BranchSidebar'
import BranchAdminDashboard from './pages/branchAdmin/BranchAdminDashboard'
import Stock from './pages/branchAdmin/Stock'
import RequestStock from './pages/branchAdmin/RequestStock'
import RequestStockBranch from './pages/admin/RequestStockBranch'
import BranchOrders from './pages/branchAdmin/BranchOrders'
import BranchProfile from './pages/branchAdmin/BranchProfile'

const App = () => {
  return (
    <div>
      <Routes>
        {/* ======================================================== */}
        {/* PUBLIC ACCESSIBLE ROUTES (No Login Required)              */}
        {/* ======================================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/allproducts" element={<AllProducts />} />
        <Route path="/products/t-shirts" element={<TShirts />} />
        <Route path="/products/shoes" element={<Shoes />} />
        <Route path="/products/watches" element={<Watches />} />
        <Route path="/products/belts" element={<Belts />} />
        <Route path="/product/:id" element={<ProductDetailView />} />

        {/* ======================================================== */}
        {/* GUEST ONLY ROUTES (Logged in users cannot revisit these) */}
        {/* ======================================================== */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ======================================================== */}
        {/* SECURED CUSTOMER ROUTES (Must be logged in)               */}
        {/* ======================================================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/track/:id" element={<OrderStatusDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ======================================================== */}
        {/* SECURED SUPER ADMIN                               */}
        {/* ======================================================== */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route
            path="/admin/*"
            element={
              <div className="flex flex-col lg:flex-row bg-royal-dark min-h-screen text-white antialiased">
                <Sidebar />
                <div className="flex-1 overflow-x-hidden bg-royal-dark/30">
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<AddProducts />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="create-branch-admin" element={<BranchAdmin />} />
                    <Route path="stock-request" element={<RequestStockBranch />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>

        {/* ======================================================== */}
        {/* SECURED BRANCH ADMIN                              */}
        {/* ======================================================== */}
        <Route element={<ProtectedRoute requiredRole="branch_admin" />}>
          <Route
            path="/branch-admin/*"
            element={
              <div className="flex flex-col lg:flex-row bg-[#071640] min-h-screen text-white antialiased">
                {/* Clean layout segmentation tailored specifically for Branch operations context */}
                <BranchSidebar />

                <div className="flex-1 overflow-x-hidden bg-white/[0.02] backdrop-blur-md p-6 lg:p-10">
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<BranchAdminDashboard />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="orders" element={<BranchOrders />} />
                    <Route path="request-stock" element={<RequestStock />} />
                    <Route path="profile" element={<BranchProfile />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>

        {/* Catch-all fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App