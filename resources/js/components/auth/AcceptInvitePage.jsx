import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';

export default function AcceptInvitePage({ token }) {
  const { isLoggedIn, user, setUser } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    api.get(`/invitations/${token}`)
      .then(({ data }) => {
        setInvitation(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Invitacion invalida o expirada');
        setLoading(false);
      });
  }, [token]);

  const handleAccept = async (e) => {
    e?.preventDefault();
    setAccepting(true);
    setError('');
    try {
      const payload = needsRegistration ? { name, password } : {};
      const { data } = await api.post(`/invitations/${token}/accept`, payload);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al aceptar invitacion';
      if (err.response?.status === 422 && !name) {
        setNeedsRegistration(true);
      } else {
        setError(msg);
      }
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0B', color: '#666' }}>
        Cargando...
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0A0A0B', fontFamily: "'Outfit', sans-serif", padding: 20,
      }}>
        <div style={{
          textAlign: 'center', background: '#111113', borderRadius: 20, padding: '48px 32px',
          border: '1px solid rgba(255,255,255,0.06)', maxWidth: 380,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128533;</div>
          <h2 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>Invitacion no valida</h2>
          <p style={{ color: '#666', fontSize: 13 }}>{error}</p>
          <a href="/" style={{ color: '#6C5CE7', fontSize: 13, marginTop: 20, display: 'inline-block' }}>
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0B', fontFamily: "'Outfit', sans-serif", padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#111113',
        borderRadius: 20, padding: '40px 32px',
        border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700,
          color: '#fff', margin: '0 0 8px',
        }}>Invitacion</h1>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>
          Has sido invitado a <strong style={{ color: '#fff' }}>{invitation?.organization?.name}</strong>
          {' '}como <strong style={{ color: '#6C5CE7' }}>{invitation?.role === 'admin' ? 'Administrador' : 'Miembro'}</strong>
        </p>

        {error && (
          <div style={{
            padding: '10px 12px', marginBottom: 12, borderRadius: 8,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#EF4444', fontSize: 12,
          }}>{error}</div>
        )}

        {needsRegistration ? (
          <form onSubmit={handleAccept}>
            <p style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
              Crea tu cuenta para unirte
            </p>
            <input value={invitation?.email || ''} disabled
              style={{ ...inputStyle, opacity: 0.5 }} />
            <input value={name} onChange={e => setName(e.target.value)}
              type="text" placeholder="Tu nombre" autoFocus
              style={inputStyle} />
            <input value={password} onChange={e => setPassword(e.target.value)}
              type="password" placeholder="Contrasena (min. 6 caracteres)"
              style={{ ...inputStyle, marginBottom: 16 }} />
            <button type="submit" disabled={accepting || !name || !password} style={btnStyle(accepting)}>
              {accepting ? 'Aceptando...' : 'Crear Cuenta y Unirse'}
            </button>
          </form>
        ) : (
          <button onClick={handleAccept} disabled={accepting} style={btnStyle(accepting)}>
            {accepting ? 'Aceptando...' : 'Aceptar Invitacion'}
          </button>
        )}
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

const btnStyle = (loading) => ({
  width: '100%', padding: '14px',
  background: 'linear-gradient(135deg, #6C5CE7, #E17055)',
  border: 'none', borderRadius: 12, color: '#fff', fontSize: 14,
  fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
  opacity: loading ? 0.7 : 1,
});
