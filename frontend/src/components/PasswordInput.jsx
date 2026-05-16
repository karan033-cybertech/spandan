import React, { useState } from 'react'
import useThemeStore from '../stores/themeStore'

export default function PasswordInput({ value, onChange, placeholder, required, style, ...props }) {
  const [show, setShow] = useState(false)
  const { isDark } = useThemeStore()

  const bg = style?.background || (isDark ? '#1e293b' : 'white')
  const borderColor = isDark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '14px 44px 14px 16px',
          fontSize: '16px',
          border: `2px solid ${borderColor}`,
          borderRadius: '12px',
          background: bg,
          color: isDark ? '#f1f5f9' : '#1e293b',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.3s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = borderColor}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: isDark ? '#94a3b8' : '#64748b',
          padding: '4px'
        }}
        tabIndex={-1}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  )
}