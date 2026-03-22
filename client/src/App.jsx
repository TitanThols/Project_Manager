import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './assets/pages/LandingPage'
import LoginPage from './assets/pages/LoginPage'
import SignupPage from './assets/pages/SignupPage'
import Dashboard from './assets/pages/Dashboard'
import { useAuth } from './assets/context/AuthContext'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App