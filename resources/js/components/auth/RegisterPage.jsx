import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';

export default function RegisterPage({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Error al registrarse';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data } = await api.get('/auth/google/redirect');
      window.location.href = data.url;
    } catch (err) {
      setError('Error al conectar con Google');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0B', fontFamily: "'Outfit', sans-serif", padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 380, background: '#111113',
        borderRadius: 20, padding: '40px 32px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.svg" alt="IBBSC" style={{ width: 48, height: 48, marginBottom: 16 }} />
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700,
            color: '#fff', margin: '0 0 4px',
          }}>Crear Cuenta</h1>
          <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Registra tu iglesia en minutos</p>
        </div>

        <button onClick={handleGoogleLogin} style={{
          width: '100%', padding: '12px', marginBottom: 20,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, color: '#E8E8E8', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Registrarse con Google
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <form onSubmit={handleRegister}>
          <input value={name} onChange={e => setName(e.target.value)}
            type="text" placeholder="Tu nombre" autoComplete="name"
            style={inputStyle} />
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="Email" autoComplete="email"
            style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="Contrasena (min. 6 caracteres)" autoComplete="new-password"
            style={{ ...inputStyle, marginBottom: 16 }} />

          {error && (
            <div style={{
              padding: '10px 12px', marginBottom: 12, borderRadius: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#EF4444', fontSize: 12,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #6C5CE7, #E17055)',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
            fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
          Ya tienes cuenta?{' '}
          <button onClick={onSwitchToLogin} style={{
            background: 'none', border: 'none', color: '#6C5CE7',
            cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          }}>Iniciar Sesion</button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '11px 14px', marginBottom: 10,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, color: '#E8E8E8', fontSize: 13, outline: 'none',
  fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box',
};
