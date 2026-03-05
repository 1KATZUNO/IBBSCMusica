import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function OrganizationSetupPage() {
  const { setupOrganization } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await setupOrganization(name.trim());
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear organizacion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0B', fontFamily: "'Outfit', sans-serif", padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: '#111113',
        borderRadius: 20, padding: '48px 32px',
        border: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#9962;</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
          color: '#fff', margin: '0 0 8px',
        }}>Configura tu Iglesia</h1>
        <p style={{ color: '#666', fontSize: 14, margin: '0 0 32px', lineHeight: 1.5 }}>
          Ingresa el nombre de tu iglesia para crear tu espacio de trabajo
        </p>

        <form onSubmit={handleSubmit}>
          <input value={name} onChange={e => setName(e.target.value)}
            type="text" placeholder="Nombre de tu iglesia"
            autoFocus
            style={{
              width: '100%', padding: '14px 16px', marginBottom: 16,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: '#E8E8E8', fontSize: 15, outline: 'none',
              fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box',
              textAlign: 'center',
            }} />

          {error && (
            <div style={{
              padding: '10px 12px', marginBottom: 12, borderRadius: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#EF4444', fontSize: 12,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading || !name.trim()} style={{
            width: '100%', padding: '14px',
            background: name.trim() ? 'linear-gradient(135deg, #6C5CE7, #E17055)' : 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 12, color: '#fff', fontSize: 15,
            fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default', fontFamily: "'Outfit', sans-serif",
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}>
            {loading ? 'Creando...' : 'Comenzar'}
          </button>
        </form>

        <p style={{ color: '#444', fontSize: 11, marginTop: 24 }}>
          Podras invitar a miembros de tu equipo despues
        </p>
      </div>
    </div>
  );
}
