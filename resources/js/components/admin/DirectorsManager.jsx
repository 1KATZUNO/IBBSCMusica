import { useState, useEffect } from 'react';
import api from '../../api/client';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function DirectorsManager({ showNotif }) {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDirectors = async () => {
    try {
      const { data } = await api.get('/directors');
      setDirectors(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDirectors(); }, []);

  const startNew = () => {
    setEditingId('new');
    setForm({ nombre: '' });
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setForm({ nombre: d.nombre });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '' });
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      showNotif('El nombre es requerido', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId === 'new') {
        await api.post('/directors', form);
        showNotif('Director creado');
      } else {
        await api.put(`/directors/${editingId}`, form);
        showNotif('Director actualizado');
      }
      cancelEdit();
      fetchDirectors();
    } catch (e) {
      showNotif(e.response?.data?.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (d) => {
    try {
      await api.put(`/directors/${d.id}`, { activo: !d.activo });
      fetchDirectors();
      showNotif(d.activo ? 'Director desactivado' : 'Director activado');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/directors/${deleteTarget.id}`);
      showNotif('Director eliminado');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) cancelEdit();
      fetchDirectors();
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        👤 Directores
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Directores de música disponibles</p>

      <button onClick={startNew} style={{
        padding: "10px 16px", background: "rgba(255,255,255,0.12)",
        border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
        fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", marginBottom: 16,
      }}>+ Nuevo Director</button>

      {editingId && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre</label>
          <input value={form.nombre} onChange={e => setForm({ nombre: e.target.value })}
            placeholder="Nombre del director" style={{ ...inputStyle, marginTop: 4 }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={cancelEdit} style={{
              padding: "8px 16px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "8px 16px", background: "rgba(255,255,255,0.12)",
              border: "none", borderRadius: 8, color: "#fff", fontSize: 12,
              fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              opacity: saving ? 0.7 : 1,
            }}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Cargando...</div>
      ) : (
        <div>
          {directors.map(d => (
            <div key={d.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", marginBottom: 4, borderRadius: 10,
              background: editingId === d.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: d.activo ? "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))" : "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: d.activo ? "#fff" : "#555", fontSize: 11, fontWeight: 700,
                }}>{d.nombre[0]}</div>
                <div>
                  <div style={{ color: d.activo ? "#E8E8E8" : "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 500 }}>{d.nombre}</div>
                  <div style={{ fontSize: 10, color: d.activo ? "#6B8F71" : "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {d.activo ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleToggleActive(d)} style={{
                  padding: "4px 10px", background: d.activo ? "rgba(107,143,113,0.1)" : "rgba(255,255,255,0.04)",
                  border: d.activo ? "1px solid rgba(107,143,113,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6, color: d.activo ? "#6B8F71" : "rgba(255,255,255,0.35)", fontSize: 11,
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>{d.activo ? 'Desactivar' : 'Activar'}</button>
                <button onClick={() => startEdit(d)} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Editar</button>
                <button onClick={() => setDeleteTarget(d)} style={{
                  padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 6, color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Eliminar</button>
              </div>
            </div>
          ))}
          {directors.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#555" }}>No hay directores registrados</div>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar Director"
          message={`¿Eliminar a "${deleteTarget.nombre}"? Los cultos asignados a este director quedarán sin director.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
