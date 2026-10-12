import React, { useMemo } from 'react'

/**
 * Visual password strength meter shown on the signup form.
 */
function getStrength(password) {
  if (!password) return { score: 0, label: '', key: '' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const map = ['', 'weak', 'fair', 'good', 'strong']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score], key: map[score] }
}

function PasswordStrength({ password }) {
  const { score, label, key } = useMemo(() => getStrength(password), [password])

  if (!password) return null

  return (
    <div className="password-strength" aria-live="polite" aria-label={`Password strength: ${label}`}>
      <div className="strength-bar">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`strength-segment${i <= score ? ` active-${key}` : ''}`}
          />
        ))}
      </div>
      <span className={`strength-label ${key}`}>{label}</span>
    </div>
  )
}

export default PasswordStrength
