import React from 'react'

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '60px 80px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          color: 'white'
        }}>
          ✨ spandan.fun ✨
        </h1>
        <div style={{
          width: '80px',
          height: '4px',
          background: '#ffd700',
          margin: '20px auto',
          borderRadius: '2px'
        }}></div>
        <p style={{
          fontSize: '1.8rem',
          margin: '20px 0',
          color: '#ffd700'
        }}>
          Spandan which is a fun 🎉
        </p>
        <div style={{
          width: '80px',
          height: '4px',
          background: '#ffd700',
          margin: '20px auto',
          borderRadius: '2px'
        }}></div>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          marginTop: '20px',
          color: 'white'
        }}>
          By Rohit Sharma | Built by Spandan_Astra ⭐
        </p>
        <div style={{ marginTop: '30px' }}>
          <a
            href="/auth"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px 25px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              margin: '0 10px',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = '#ffd700'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage