import { useState } from 'react'
import { FolderKanban } from 'lucide-react'
import styles from './SignupPage.module.css'
import { useNavigate } from 'react-router-dom'
import { signup } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const data = await signup(name, email, password, confirmPassword)
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
        <p className={styles.logoSub}>Start managing your projects today</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Create an account</h2>
        <p className={styles.cardSub}>Enter your information to get started</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Kokki Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>

      <footer className={styles.footer}>© 2026 ProMap. All rights reserved.</footer>
    </div>
  )
}