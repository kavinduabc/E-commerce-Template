import React from 'react'

/**
 * Left-panel branding shown on both login and signup pages.
 */
function AuthBranding({ heading, sub, features }) {
  return (
    <aside className="auth-branding" aria-label="ShopHub branding">
      <div className="branding-content">
        <div className="branding-logo">
          <div className="logo-icon" aria-hidden="true">🛍️</div>
          <span className="logo-text">ShopHub</span>
        </div>

        <h2 className="branding-heading">{heading}</h2>
        <p className="branding-sub">{sub}</p>

        <div className="branding-features" aria-label="Key features">
          {features.map(({ icon, text }) => (
            <div key={text} className="feature-item">
              <span className="feature-icon" aria-hidden="true">{icon}</span>
              <span className="feature-text">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default AuthBranding
