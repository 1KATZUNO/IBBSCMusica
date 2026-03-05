import { useState, useEffect } from 'react';
import api from '../../api/client';

const inputStyle = {
  padding: "9px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box",
};

export default function ServidoresManager({ showNotif }) {
  const [servidores, setServidores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editRoles, setEditRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get('/servidores'),
      api.get('/servidor-roles'),
    ]).then(([s, r]) => {
      setServidores(s.data);
      setRoles(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!nombre.trim()) return;
    try {
      await api.post('/servidores', { nombre: nombre.trim(), role_ids: selectedRoles });
      setNombre('');
      setSelectedRoles([]);
      fetchData();
      showNotif('Servidor agregado');
    } catch (e) {
      showNotif('Error al agregar', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/servidores/${editingId}`, { nombre: editNombre, role_ids: editRoles });
      setEditingId(null);
      fetchData();
      showNotif('Servidor actualizado');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/servidores/${id}`);
      fetchData();
      showNotif('Servidor eliminado');
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  const toggleRole = (roleId, list, setList) => {
    if (list.includes(roleId)) {
      setList(list.filter(r => r !== roleId));
    } else if (list.length < 4) {
      setList([...list, roleId]);
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditNombre(s.nombre);
    setEditRoles(s.roles.map(r => r.id));
  };

  if (loading) return <div style={{ color: '#555', padding: 20 }}>Cargando...</div>;

  return (
    <div>
      <h2 style={{
        fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: '#fff',
        margin: '0 0 20px',
      }}>Servidores</h2>

      {/* Add form */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder="Nombre del servidor" style={{ ...inputStyle, flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button onClick={handleAdd} disabled={!nombre.trim()} style={{
            padding: "9px 18px", background: nombre.trim() ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(108,92,231,0.3)', borderRadius: 8,
            color: '#6C5CE7', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
          }}>Agregar</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {roles.map(r => (
            <button key={r.id} onClick={() => toggleRole(r.id, selectedRoles, setSelectedRoles)} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", border: 'none',
              background: selectedRoles.includes(r.id) ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)',
              color: selectedRoles.includes(r.id) ? '#6C5CE7' : '#888',
            }}>{r.nombre}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {servidores.map(s => (
          <div key={s.id} style={{
            padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
          }}>
            {editingId === s.id ? (
              <div>
                <input value={editNombre} onChange={e => setEditNombre(e.target.value)}
                  style={{ ...inputStyle, width: '100%', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {roles.map(r => (
                    <button key={r.id} onClick={() => toggleRole(r.id, editRoles, setEditRoles)} style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif", border: 'none',
                      background: editRoles.includes(r.id) ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)',
                      color: editRoles.includes(r.id) ? '#6C5CE7' : '#888',
                    }}>{r.nombre}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handleUpdate} style={{
                    padding: '6px 14px', background: 'rgba(108,92,231,0.15)', border: 'none',
                    borderRadius: 6, color: '#6C5CE7', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                  }}>Guardar</button>
                  <button onClick={() => setEditingId(null)} style={{
                    padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: 'none',
                    borderRadius: 6, color: '#888', fontSize: 11, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                  }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#E8E8E8', fontSize: 14, fontWeight: 600 }}>
                    {s.nombre}
                    {!s.activo && <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>(inactivo)</span>}
                  </div>
                  {s.roles.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {s.roles.map(r => (
                        <span key={r.id} style={{
                          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: 'rgba(108,92,231,0.1)', color: '#6C5CE7',
                        }}>{r.nombre}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(s)} style={{
                    padding: '5px 12px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                    color: '#aaa', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                  }}>Editar</button>
                  <button onClick={() => handleDelete(s.id)} style={{
                    padding: '5px 12px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                    color: '#EF4444', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                  }}>Eliminar</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {servidores.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: '#444', fontSize: 13 }}>
            No hay servidores. Agrega el primero arriba.
          </div>
        )}
      </div>
    </div>
  );
}
