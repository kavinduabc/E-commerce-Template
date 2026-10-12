import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUser, FiMail, FiLock, FiPhone,
  FiAlertCircle, FiArrowRight,
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import AuthBranding from '../components/auth/AuthBranding'
import InputField from '../components/auth/InputField'
import PasswordStrength from '../components/auth/PasswordStrength'
import { signupAPI } from '../services/auth.service'
import '../../src/styles/auth.css'

const BRANDING = {
  heading: <>Join <span>ShopHub</span> today</>,
  sub: 'Discover millions of products. Create your free account and start shopping smarter.',
  features: [
    { icon: '🛒', text: 'Access millions of products' },
    { icon: '📦', text: 'Free delivery on first 3 orders' },
    { icon: '💳', text: 'Secure payment & buyer protection' },
    { icon: '⭐', text: 'Earn reward points on every purchase' },
  ],
}

function validate(fields) {
  const errors = {}

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.'
  } else if (fields.firstName.trim().length < 2) {
    errors.firstName = 'At least 2 characters required.'
  }

  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  } else if (fields.lastName.trim().length < 2) {
    errors.lastName = 'At least 2 characters required.'
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^\+?[\d\s\-().]{7,15}$/.test(fields.phone)) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function SignupPage() {
  const [fields, setFields] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [termsError, setTermsError] = useState('')

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
    const allTouched = Object.fromEntries(Object.keys(INITIAL).map((k) => [k, true]))
    setTouched(allTouched)
    const validationErrors = validate(fields)
    setErrors(validationErrors)

    if (!agreeTerms) {
      setTermsError('You must agree to the Terms & Privacy Policy.')
    } else {
      setTermsError('')
    }

    if (Object.keys(validationErrors).length > 0 || !agreeTerms) return

    setLoading(true)
    setServerError('')
    try {
      await signupAPI({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        phone: fields.phone,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
      })
      setSuccess(true)
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-wrapper">
        <AuthBranding {...BRANDING} />
        <main className="auth-form-panel">
          <div className="auth-form-container signup" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>
              Account Created!
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
              Welcome to ShopHub, <strong>{fields.firstName}</strong>!
              Check your inbox to verify your email.
            </p>
            <Link to="/login">
              <button className="submit-btn" style={{ maxWidth: 280, margin: '0 auto' }}>
                Go to Login <FiArrowRight />
              </button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="auth-wrapper">
      <AuthBranding {...BRANDING} />

      <main className="auth-form-panel">
        <div className="auth-form-container signup">
          <header className="form-header">
            <h1>Create your account</h1>
            <p>Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                Sign in
              </Link>
            </p>
          </header>

          {/* Social signup */}
          <div className="social-buttons" role="group" aria-label="Social signup options">
            <button type="button" className="social-btn" aria-label="Sign up with Google">
              <FcGoogle /> Google
            </button>
            <button type="button" className="social-btn" aria-label="Sign up with Facebook">
              <FaFacebook style={{ color: '#1877f2' }} /> Facebook
            </button>
          </div>

          <div className="divider" aria-hidden="true">
            <div className="divider-line" />
            <span className="divider-text">or register with email</span>
            <div className="divider-line" />
          </div>

          {serverError && (
            <div className="alert alert-error" role="alert">
              <FiAlertCircle style={{ flexShrink: 0, marginTop: 1 }} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
            {/* Name row */}
            <div className="form-row">
              <InputField
                id="firstName"
                label="First name"
                placeholder="John"
                value={fields.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                icon={FiUser}
                autoComplete="given-name"
                required
              />
              <InputField
                id="lastName"
                label="Last name"
                placeholder="Doe"
                value={fields.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                icon={FiUser}
                autoComplete="family-name"
                required
              />
            </div>

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
              id="phone"
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={fields.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              icon={FiPhone}
              autoComplete="tel"
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={fields.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              icon={FiLock}
              autoComplete="new-password"
              required
            />
            <PasswordStrength password={fields.password} />

            <div style={{ marginTop: 14 }}>
              <InputField
                id="confirmPassword"
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                value={fields.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                icon={FiLock}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Terms */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontWeight: 400 }}
              >
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked)
                    if (e.target.checked) setTermsError('')
                  }}
                  style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0 }}
                  aria-describedby={termsError ? 'terms-error' : undefined}
                />
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  I agree to ShopHub's{' '}
                  <Link to="/terms" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Privacy Policy</Link>
                </span>
              </label>
              {termsError && (
                <span id="terms-error" className="field-error" role="alert">
                  {termsError}
                </span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="switch-link">
            Already have an account?{' '}
            <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default SignupPage
