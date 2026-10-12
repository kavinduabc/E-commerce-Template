import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

/**
 * Reusable form input with icon, error state, and password toggle.
 */
function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  autoComplete,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`form-group${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span style={{ color: 'var(--color-primary)', marginLeft: 3 }}>*</span>}
      </label>
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          required={required}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default InputField
