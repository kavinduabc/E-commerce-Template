import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import AuthBranding from '../components/auth/AuthBranding'
import InputField from '../components/auth/InputField'
import { loginAPI } from '../services/auth.service'
import '../../src/styles/auth.css'

const BRANDING = {
  heading: <>Welcome back to <span>ShopHub</span></>,
  sub: 'Your favorite products are waiting. Sign in to continue your shopping journey.',
  features: [
    { icon: '🚀', text: 'Lightning-fast checkout experience' },
    { icon: '🔒', text: 'Bank-grade security for your data' },
    { icon: '🎁', text: 'Exclusive deals for members' },
  ],
}

function validate(fields) {
  const errors = {}
  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  return errors
}

function LoginPage() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const newErrors = validate(fields)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { email: true, password: true }
    setTouched(allTouched)
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    setServerError('')
    try {
      const { data } = await loginAPI({ email: fields.email, password: fields.password })
      // Store access token (in-memory or localStorage for demo)
      sessionStorage.setItem('accessToken', data.accessToken)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <AuthBranding {...BRANDING} />

      <main className="auth-form-panel">
        <div className="auth-form-container">
          <header className="form-header">
            <h1>Sign in to your account</h1>
            <p>Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                Create one free
              </Link>
            </p>
          </header>

          {/* Social login */}
          <div className="social-buttons" role="group" aria-label="Social login options">
            <button type="button" className="social-btn" aria-label="Sign in with Google">
              <FcGoogle /> Google
            </button>
            <button type="button" className="social-btn" aria-label="Sign in with Facebook">
              <FaFacebook style={{ color: '#1877f2' }} /> Facebook
            </button>
          </div>

          <div className="divider" aria-hidden="true">
            <div className="divider-line" />
            <span className="divider-text">or continue with email</span>
            <div className="divider-line" />
          </div>

          {serverError && (
            <div className="alert alert-error" role="alert">
              <FiAlertCircle style={{ flexShrink: 0, marginTop: 1 }} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Login form">
            <InputField
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              icon={FiMail}
              autoComplete="email"
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              icon={FiLock}
              autoComplete="current-password"
              required
            />

            <div className="form-meta">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  aria-label="Remember me"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="switch-link">
            New to ShopHub?{' '}
            <Link to="/signup">Create a free account</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
