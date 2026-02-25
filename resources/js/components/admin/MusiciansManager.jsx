import { useState, useEffect } from 'react';
import { useMusicians } from '../../hooks/useMusicians';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function MusiciansManager({ showNotif }) {
  const { musicians, musicianRoles, loading, fetchMusicians, fetchMusicianRoles, createMusician, updateMusician, deleteMusician } = useMusicians();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '', role_ids: [] });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMusicians(); fetchMusicianRoles(); }, []);

  const startNew = () => {
    setEditingId('new');
    setForm({ nombre: '', role_ids: [] });
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({ nombre: m.nombre, role_ids: m.roles.map(r => r.id) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '', role_ids: [] });
  };

  const toggleRole = (roleId) => {
    setForm(f => {
      const has = f.role_ids.includes(roleId);
      if (has) {
        return { ...f, role_ids: f.role_ids.filter(id => id !== roleId) };
      }
      if (f.role_ids.length >= 3) return f;
      return { ...f, role_ids: [...f.role_ids, roleId] };
    });
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || form.role_ids.length === 0) {
      showNotif('Nombre y al menos un rol son requeridos', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId === 'new') {
        await createMusician(form);
        showNotif('Músico creado');
      } else {
        await updateMusician(editingId, form);
        showNotif('Músico actualizado');
      }
      cancelEdit();
    } catch (e) {
      showNotif(e.response?.data?.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMusician(deleteTarget.id);
      showNotif('Músico eliminado');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) cancelEdit();
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        🎸 Músicos
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Músicos registrados del ministerio</p>

      <button onClick={startNew} style={{
        padding: "10px 16px", background: "rgba(255,255,255,0.12)",
        border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
        fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", marginBottom: 16,
      }}>+ Nuevo Músico</button>

      {/* Form */}
      {editingId && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre</label>
          <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            placeholder="Nombre del músico" style={{ ...inputStyle, marginTop: 4 }} />

          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>
            Roles (máx. 3)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {musicianRoles.map(role => (
              <button key={role.id} onClick={() => toggleRole(role.id)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                background: form.role_ids.includes(role.id) ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                border: form.role_ids.includes(role.id) ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                color: form.role_ids.includes(role.id) ? "#fff" : "#999",
              }}>{role.nombre}</button>
            ))}
          </div>

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

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Cargando...</div>
      ) : (
        <div>
          {musicians.map(m => (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", marginBottom: 4, borderRadius: 10,
              background: editingId === m.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div>
                <div style={{ color: "#E8E8E8", fontSize: 14, fontWeight: 500 }}>{m.nombre}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  {m.roles.map(r => (
                    <span key={r.id} style={{
                      padding: "2px 8px", background: "rgba(255,255,255,0.08)",
                      borderRadius: 10, fontSize: 10, color: "rgba(255,255,255,0.7)",
                    }}>{r.nombre}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(m)} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Editar</button>
                <button onClick={() => setDeleteTarget(m)} style={{
                  padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 6, color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar Músico"
          message={`¿Eliminar a "${deleteTarget.nombre}"?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
