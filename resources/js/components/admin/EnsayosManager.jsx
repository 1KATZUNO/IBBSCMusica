import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import CreateEnsayoModal from '../modals/CreateEnsayoModal';
import CantoSearchInput from '../shared/CantoSearchInput';

const inputStyle = {
  padding: "9px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box",
};

function formatFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function EnsayosManager({ showNotif }) {
  const { isAdmin } = useAuth();
  const [ensayos, setEnsayos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Cantos for search
  const [cantos, setCantos] = useState([]);
  const [searchCantoId, setSearchCantoId] = useState('');

  // Asistente input
  const [nuevoAsistente, setNuevoAsistente] = useState('');

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchEnsayos = async () => {
    try {
      const { data } = await api.get('/ensayos');
      setEnsayos(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/ensayos/${id}`);
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchCantos = async () => {
    const { data } = await api.get('/cantos');
    setCantos(data);
  };

  useEffect(() => {
    fetchEnsayos();
    fetchCantos();
  }, []);

  useEffect(() => {
    if (selectedId) fetchDetail(selectedId);
    else setDetail(null);
  }, [selectedId]);

  const handleCreate = async (formData) => {
    try {
      await api.post('/ensayos', formData);
      setShowCreateModal(false);
      fetchEnsayos();
      showNotif('Ensayo creado');
    } catch {
      showNotif('Error al crear ensayo', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ensayos/${id}`);
      if (selectedId === id) {
        setSelectedId(null);
        setDetail(null);
      }
      fetchEnsayos();
      showNotif('Ensayo eliminado');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/ensayos/${selectedId}`, editData);
      setDetail(data);
      setEditing(false);
      fetchEnsayos();
      showNotif('Ensayo actualizado');
    } catch {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleAddCanto = async () => {
    if (!searchCantoId) return;
    try {
      const { data } = await api.post(`/ensayos/${selectedId}/cantos`, { canto_id: Number(searchCantoId) });
      setDetail(data);
      setSearchCantoId('');
      fetchEnsayos();
      showNotif('Canto agregado');
    } catch {
      showNotif('Error al agregar canto', 'error');
    }
  };

  const handleRemoveCanto = async (cantoId) => {
    try {
      const { data } = await api.delete(`/ensayos/${selectedId}/cantos/${cantoId}`);
      setDetail(data);
      fetchEnsayos();
      showNotif('Canto removido');
    } catch {
      showNotif('Error al remover canto', 'error');
    }
  };

  const handleAddAsistente = async () => {
    if (!nuevoAsistente.trim()) return;
    try {
      const { data } = await api.post(`/ensayos/${selectedId}/asistentes`, { nombre: nuevoAsistente.trim() });
      setDetail(data);
      setNuevoAsistente('');
      fetchEnsayos();
      showNotif('Asistente agregado');
    } catch {
      showNotif('Error al agregar asistente', 'error');
    }
  };

  const handleRemoveAsistente = async (asistId) => {
    try {
      await api.delete(`/ensayo-asistentes/${asistId}`);
      fetchDetail(selectedId);
      fetchEnsayos();
      showNotif('Asistente removido');
    } catch {
      showNotif('Error al remover asistente', 'error');
    }
  };

  const startEdit = () => {
    setEditing(true);
    setEditData({
      fecha: detail.fecha?.split('T')[0],
      hora_inicio: detail.hora_inicio,
      hora_fin: detail.hora_fin,
      notas: detail.notas || '',
    });
  };

  if (loading) return <div style={{ color: '#555', padding: 20 }}>Cargando...</div>;

  // Detail view
  if (selectedId && detail) {
    return (
      <div>
        <button onClick={() => { setSelectedId(null); setEditing(false); }} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.4)",
          fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
          marginBottom: 16, padding: 0,
        }}>&larr; Volver a ensayos</button>

        {detailLoading ? (
          <div style={{ color: '#555', padding: 20 }}>Cargando...</div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20,
            }}>
              {editing ? (
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <input type="date" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })}
                      style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
                    <input type="time" value={editData.hora_inicio} onChange={e => setEditData({ ...editData, hora_inicio: e.target.value })}
                      style={{ ...inputStyle, width: 110 }} />
                    <input type="time" value={editData.hora_fin} onChange={e => setEditData({ ...editData, hora_fin: e.target.value })}
                      style={{ ...inputStyle, width: 110 }} />
                  </div>
                  <textarea value={editData.notas} onChange={e => setEditData({ ...editData, notas: e.target.value })}
                    placeholder="Notas..." rows={2}
                    style={{ ...inputStyle, width: '100%', marginBottom: 8, resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={handleUpdate} style={{
                      padding: '6px 14px', background: 'rgba(108,92,231,0.15)', border: 'none',
                      borderRadius: 6, color: '#6C5CE7', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                    }}>Guardar</button>
                    <button onClick={() => setEditing(false)} style={{
                      padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: 'none',
                      borderRadius: 6, color: '#888', fontSize: 11, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                    }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>
                      {formatFecha(detail.fecha)}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
                      {detail.hora_inicio} - {detail.hora_fin}
                    </div>
                    {detail.notas && (
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
                        {detail.notas}
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={startEdit} style={{
                        padding: '5px 12px', background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                        color: '#aaa', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                      }}>Editar</button>
                      <button onClick={() => handleDelete(selectedId)} style={{
                        padding: '5px 12px', background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                        color: '#EF4444', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                      }}>Eliminar</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cantos section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase", letterSpacing: 3, marginBottom: 10,
              }}>Cantos a ensayar</div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <CantoSearchInput cantos={cantos} selectedCantoId={searchCantoId} onSelect={setSearchCantoId} />
                  </div>
                  <button onClick={handleAddCanto} disabled={!searchCantoId} style={{
                    padding: "9px 16px", background: searchCantoId ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(108,92,231,0.3)', borderRadius: 8,
                    color: '#6C5CE7', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                  }}>Agregar</button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {detail.cantos?.map((c, i) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, width: 18,
                      }}>{i + 1}</span>
                      <span style={{ color: '#E8E8E8', fontSize: 13 }}>{c.nombre}</span>
                    </div>
                    {isAdmin && (
                      <button onClick={() => handleRemoveCanto(c.id)} style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)',
                        fontSize: 14, cursor: 'pointer', padding: '2px 6px',
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
                      >&times;</button>
                    )}
                  </div>
                ))}
                {(!detail.cantos || detail.cantos.length === 0) && (
                  <div style={{ color: '#444', fontSize: 12, padding: 8 }}>No hay cantos en este ensayo</div>
                )}
              </div>
            </div>

            {/* Asistentes section */}
            <div>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase", letterSpacing: 3, marginBottom: 10,
              }}>Asistentes</div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={nuevoAsistente} onChange={e => setNuevoAsistente(e.target.value)}
                    placeholder="Nombre del asistente"
                    style={{ ...inputStyle, flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && handleAddAsistente()} />
                  <button onClick={handleAddAsistente} disabled={!nuevoAsistente.trim()} style={{
                    padding: "9px 16px",
                    background: nuevoAsistente.trim() ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(108,92,231,0.3)', borderRadius: 8,
                    color: '#6C5CE7', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                  }}>Agregar</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {detail.asistentes?.map(a => (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', background: 'rgba(108,92,231,0.1)',
                    borderRadius: 20, fontSize: 12, color: '#ccc',
                  }}>
                    {a.nombre}
                    {isAdmin && (
                      <button onClick={() => handleRemoveAsistente(a.id)} style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                        fontSize: 13, cursor: 'pointer', padding: 0, lineHeight: 1,
                      }}>&times;</button>
                    )}
                  </div>
                ))}
                {(!detail.asistentes || detail.asistentes.length === 0) && (
                  <div style={{ color: '#444', fontSize: 12 }}>No hay asistentes registrados</div>
                )}
              </div>
            </div>
          </>
        )}

        {showCreateModal && (
          <CreateEnsayoModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
        )}
      </div>
    );
  }

  // List view
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: '#fff', margin: 0,
        }}>Ensayos</h2>
        {isAdmin && (
          <button onClick={() => setShowCreateModal(true)} style={{
            padding: "8px 16px", background: "rgba(108,92,231,0.15)",
            border: "1px solid rgba(108,92,231,0.3)", borderRadius: 8,
            color: "#6C5CE7", fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}>+ Nuevo Ensayo</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ensayos.map(e => (
          <div key={e.id} onClick={() => setSelectedId(e.id)} style={{
            padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                  {formatFecha(e.fecha)}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3 }}>
                  {e.hora_inicio} - {e.hora_fin}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#6C5CE7', fontSize: 16, fontWeight: 700 }}>{e.cantos_count}</div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>cantos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#E17055', fontSize: 16, fontWeight: 700 }}>{e.asistentes_count}</div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>asist.</div>
                </div>
                {isAdmin && (
                  <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }} style={{
                    padding: '5px 10px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                    color: '#EF4444', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                  }}>Eliminar</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {ensayos.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#444', fontSize: 13 }}>
            {isAdmin ? 'No hay ensayos. Crea el primero con el boton de arriba.' : 'No hay ensayos programados.'}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateEnsayoModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
