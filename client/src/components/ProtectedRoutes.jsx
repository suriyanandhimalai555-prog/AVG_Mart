import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protects routes from unauthenticated users and unauthorized roles.
 */
export const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // 1. If not logged in at all, kick them back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required (like admin) and they don't match, block them
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />; 
  }

  // Otherwise, allow them through to the child routes
  return <Outlet />;
};

/**
 * Prevents logged-in users from hitting /login or /signup
 */
export const PublicOnlyRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (token) {
    // If they are an admin, redirect them away to dashboard, otherwise profile
    return userRole === "admin" 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};