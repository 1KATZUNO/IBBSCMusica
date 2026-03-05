import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function InvitationsManager({ showNotif }) {
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = () => {
    api.get('/invitations')
      .then(({ data }) => { setInvitations(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchInvitations(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await api.post('/invitations', { email, role });
      setEmail('');
      setRole('member');
      fetchInvitations();
      showNotif('Invitacion enviada');
    } catch (err) {
      showNotif(err.response?.data?.message || 'Error al enviar invitacion', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.delete(`/invitations/${id}`);
      fetchInvitations();
      showNotif('Invitacion revocada');
    } catch (err) {
      showNotif('Error al revocar', 'error');
    }
  };

  return (
    <div>
      <h2 style={{
        fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: '#fff',
        margin: '0 0 20px',
      }}>Invitaciones</h2>

      <form onSubmit={handleSend} style={{
        display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <input value={email} onChange={e => setEmail(e.target.value)}
          type="email" placeholder="Email del invitado"
          style={{
            flex: 1, minWidth: 180, padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, color: '#E8E8E8', fontSize: 13, outline: 'none',
            fontFamily: "'Outfit', sans-serif",
          }} />
        <select value={role} onChange={e => setRole(e.target.value)} style={{
          padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
          color: '#E8E8E8', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none',
        }}>
          <option value="member">Miembro</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={sending || !email} style={{
          padding: '10px 20px',
          background: email ? 'linear-gradient(135deg, #6C5CE7, #E17055)' : 'rgba(255,255,255,0.06)',
          border: 'none', borderRadius: 10, color: '#fff', fontSize: 13,
          fontWeight: 700, cursor: email ? 'pointer' : 'default', fontFamily: "'Outfit', sans-serif",
          opacity: sending ? 0.7 : 1,
        }}>
          {sending ? 'Enviando...' : 'Invitar'}
        </button>
      </form>

      {loading ? (
        <div style={{ color: '#555', fontSize: 13 }}>Cargando...</div>
      ) : invitations.length === 0 ? (
        <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: 20 }}>
          No hay invitaciones pendientes
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {invitations.map(inv => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div>
                <div style={{ color: '#E8E8E8', fontSize: 13 }}>{inv.email}</div>
                <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>
                  Rol: {inv.role === 'admin' ? 'Admin' : 'Miembro'}
                  {inv.inviter && ` · Invitado por ${inv.inviter.name}`}
                </div>
              </div>
              <button onClick={() => handleRevoke(inv.id)} style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8, color: '#EF4444', fontSize: 11, padding: '6px 12px',
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>Revocar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
