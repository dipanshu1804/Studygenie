import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  })

  const openAuth = (mode: 'login' | 'register') => setAuthModal({ open: true, mode })
  const closeAuth = () => setAuthModal((prev) => ({ ...prev, open: false }))
  const switchMode = (mode: 'login' | 'register') => setAuthModal({ open: true, mode })

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a26',
              color: '#e8e8f0',
              border: '1px solid #2e2e48',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#5fa07d', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#e05545', secondary: '#0a0a0f' } },
          }}
        />

        <Navbar onAuthClick={openAuth} />

        <Routes>
          <Route path="/" element={<HomePage onAuthClick={openAuth} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>

        {authModal.open && (
          <AuthModal
            mode={authModal.mode}
            onClose={closeAuth}
            onSwitch={switchMode}
          />
        )}
      </BrowserRouter>
    </AuthProvider>
  )
}
