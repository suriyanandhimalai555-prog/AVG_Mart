import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // <-- 1. Import Toaster
import App from './App.jsx'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Configure global default styles matching your theme */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 34, 78, 0.9)', // Deep Navy tone (--color-royal-dark)
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            fontSize: '13px',
            borderRadius: '12px'
          },
          success: {
            iconTheme: {
              primary: '#A5CE00', // Electric Lime Green (--color-lime-accent)
              secondary: '#0A224E',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)