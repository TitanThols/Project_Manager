import { useState } from 'react'
import { FolderKanban } from 'lucide-react'
import styles from './LoginPage.module.css'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      loginUser(data)
      navigate('/dashboard')
    } catch (err) {
        console.log('error:', err.response?.data)
        const data = err.response?.data
        if (data?.errors && data.errors.length > 0) {
          setError(data.errors[0])
        } else {
            setError(data?.message || 'Signup failed')
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        
        <h1 className={styles.logoText}>Pro<span>Map</span></h1>
        <p className={styles.logoSub}>Project Management Made Simple</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Welcome back</h2>
        <p className={styles.cardSub}>Enter your email and password to sign in</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <div className={styles.passwordRow}>
              <label className={styles.label}>Password</label>
              <span className={styles.forgot}>Forgot password?</span>
            </div>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/signup')}>
            Sign up
          </span>
        </p>
      </div>

      <footer className={styles.footer}>© 2026 ProMap. All rights reserved.</footer>
    </div>
  )
}