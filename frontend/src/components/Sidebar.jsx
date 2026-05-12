import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const menuItems = {
  teacher: [
    { id: 'rooms', label: 'My Rooms', icon: '🏠', path: '/teacher' },
    { id: 'questions', label: 'Questions', icon: '❓', path: '/teacher/questions' },
    { id: 'analytics', label: 'Analytics', icon: '📊', path: '/teacher/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/teacher/settings' },
  ],
  student: [
    { id: 'join', label: 'Join Room', icon: '🔗', path: '/student' },
    { id: 'myrooms', label: 'My Rooms', icon: '🏠', path: '/student/myrooms' },
    { id: 'history', label: 'History', icon: '📜', path: '/student/history' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/student/settings' },
  ]
}

export default function Sidebar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const role = user?.role || 'student'
  const items = menuItems[role] || menuItems.student

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          onClick={() => setIsCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: isCollapsed ? '72px' : '240px',
        background: 'white',
        boxShadow: '2px 0 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'width 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            <SpandanIcon />
          </div>
          {!isCollapsed && (
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>Spandan</h2>
              <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', textTransform: 'capitalize' }}>{role} Portal</p>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '-12px',
            width: '24px',
            height: '24px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 60
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {items.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '12px 16px',
                  marginBottom: '4px',
                  background: isActive ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: isActive ? 'white' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f3f4f6'
                    e.currentTarget.style.color = '#1f2937'
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', textTransform: 'capitalize' }}>{role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div style={{
        width: isCollapsed ? '72px' : '240px',
        flexShrink: 0,
        transition: 'width 0.3s ease'
      }} />
    </>
  )
}