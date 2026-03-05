import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';

export default function MembersManager({ showNotif }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = () => {
    api.get('/organization/members')
      .then(({ data }) => { setMembers(data); setLoading(false); })
      .catch(() => { showNotif('Error al cargar miembros', 'error'); setLoading(false); });
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.put(`/organization/members/${memberId}/role`, { role: newRole });
      fetchMembers();
      showNotif('Rol actualizado');
    } catch (err) {
      showNotif(err.response?.data?.message || 'Error al cambiar rol', 'error');
    }
  };

  const handleRemove = async (memberId, memberName) => {
    if (!confirm(`Eliminar a ${memberName} de la organizacion?`)) return;
    try {
      await api.delete(`/organization/members/${memberId}`);
      fetchMembers();
      showNotif('Miembro eliminado');
    } catch (err) {
      showNotif(err.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  if (loading) return <div style={{ color: '#555', padding: 20 }}>Cargando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: '#fff', margin: 0,
        }}>Miembros</h2>
        <span style={{ fontSize: 12, color: '#555' }}>{members.length} miembros</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {members.map(member => (
          <div key={member.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: member.avatar ? 'none' : 'linear-gradient(135deg, #6C5CE7, #E17055)',
                backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                backgroundSize: 'cover',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>
                {!member.avatar && (member.name?.[0] || '?')}
              </div>
              <div>
                <div style={{ color: '#E8E8E8', fontSize: 13, fontWeight: 600 }}>
                  {member.name} {member.id === user?.id && <span style={{ color: '#555', fontSize: 11 }}>(tu)</span>}
                </div>
                <div style={{ color: '#555', fontSize: 11 }}>{member.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={member.role}
                onChange={e => handleRoleChange(member.id, e.target.value)}
                disabled={member.id === user?.id}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: member.role === 'admin' ? '#6C5CE7' : '#888',
                  padding: '6px 10px', fontSize: 11, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif", cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="admin">Admin</option>
                <option value="member">Miembro</option>
              </select>
              {member.id !== user?.id && (
                <button onClick={() => handleRemove(member.id, member.name)} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)',
                  fontSize: 16, cursor: 'pointer', padding: '4px 8px',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
                >&times;</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
