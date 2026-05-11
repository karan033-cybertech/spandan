import React, { useState } from 'react'

function AuthPage() {
  const [step, setStep] = useState('role') // 'role' | 'auth'
  const [selectedRole, setSelectedRole] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setStep('auth')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`${isLogin ? 'Login' : 'Sign Up'} as ${selectedRole} - Coming soon!`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fb 0%, #e0e7ff 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-200px',
        left: '-200px',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 8s ease-in-out infinite 4s',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Role Selection Cards */}
        {step === 'role' && (
          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            width: '100%',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            {/* Logo and Title */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 20px 40px rgba(30, 64, 175, 0.3)'
              }}>
                <span style={{ fontSize: '40px' }}>✨</span>
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#1e3c72',
                marginBottom: '10px'
              }}>
                Spandan
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#6b7280'
              }}>
                Poll Question Generator
              </p>
            </div>

            {/* Role Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '30px'
            }}>
              {/* Teacher Card */}
              <div
                onClick={() => handleRoleSelect('teacher')}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '40px 30px',
                  cursor: 'pointer',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '2px solid transparent',
                  transition: 'all 0.4s ease',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Shimmer effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }} />
                
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    transition: 'transform 0.3s ease'
                  }}>
                    👨‍🏫
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    Teacher
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    Create and manage polls for your classroom
                  </p>
                  <ul style={{
                    textAlign: 'left',
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '25px',
                    listStyle: 'none',
                    padding: 0
                  }}>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6' }}>✓</span> Create assessment spaces
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6' }}>✓</span> Generate AI-powered questions
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6' }}>✓</span> View real-time results
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6' }}>✓</span> Track student performance
                    </li>
                  </ul>
                  <button style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                  }}>
                    I'm a Teacher
                  </button>
                </div>
              </div>

              {/* Student Card */}
              <div
                onClick={() => handleRoleSelect('student')}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '40px 30px',
                  cursor: 'pointer',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '2px solid transparent',
                  transition: 'all 0.4s ease',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Shimmer effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, transparent, rgba(16, 185, 129, 0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 3s ease-in-out infinite 0.5s'
                }} />
                
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    transition: 'transform 0.3s ease'
                  }}>
                    👨‍🎓
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    Student
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    Join polls and track your engagement
                  </p>
                  <ul style={{
                    textAlign: 'left',
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '25px',
                    listStyle: 'none',
                    padding: 0
                  }}>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Join poll sessions
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Submit answers live
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> View instant results
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Track your scores
                    </li>
                  </ul>
                  <button style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                  }}>
                    I'm a Student
                  </button>
                </div>
              </div>
            </div>

            <p style={{
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              You can change your role later in account settings
            </p>
          </div>
        )}

        {/* Auth Form */}
        {step === 'auth' && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            {/* Back button */}
            <button
              onClick={() => setStep('role')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Back to role selection
            </button>

            {/* Role badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: selectedRole === 'teacher' ? '#eff6ff' : '#ecfdf5',
              color: selectedRole === 'teacher' ? '#1e40af' : '#059669',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '20px'
            }}>
              <span>{selectedRole === 'teacher' ? '👨‍🏫' : '👨‍🎓'}</span>
              <span style={{ textTransform: 'capitalize' }}>{selectedRole}</span>
            </div>

            {/* Form Header */}
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '30px'
            }}>
              {isLogin 
                ? `Sign in to continue as ${selectedRole}` 
                : `Join Spandan as a ${selectedRole}`}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!isLogin && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)',
                  marginTop: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.3)'
                }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1e40af',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '13px'
      }}>
        By Rohit Sharma | Built by Spandan_Astra ⭐
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}

export default AuthPage