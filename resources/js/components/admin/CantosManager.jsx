import { useState, useEffect } from 'react';
import { useCantos } from '../../hooks/useCantos';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function CantosManager({ showNotif }) {
  const { cantos, loading, fetchCantos, createCanto, updateCanto, deleteCanto } = useCantos();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '', youtube_url: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCantos(); }, []);

  const filtered = cantos.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const startNew = () => {
    setEditingId('new');
    setForm({ nombre: '', youtube_url: '' });
  };

  const startEdit = (canto) => {
    setEditingId(canto.id);
    setForm({ nombre: canto.nombre, youtube_url: canto.youtube_url || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '', youtube_url: '' });
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      if (editingId === 'new') {
        await createCanto(form);
        showNotif('Canto creado');
      } else {
        await updateCanto(editingId, form);
        showNotif('Canto actualizado');
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
      await deleteCanto(deleteTarget.id);
      showNotif('Canto eliminado');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) cancelEdit();
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        🎵 Cantos
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Catálogo de cantos del ministerio</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar canto..." style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
        <button onClick={startNew} style={{
          padding: "10px 16px", background: "rgba(255,255,255,0.12)",
          border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
          fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap",
        }}>+ Nuevo</button>
      </div>

      {/* Form */}
      {editingId && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre</label>
          <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            placeholder="Nombre del canto" style={{ ...inputStyle, marginTop: 4 }} />
          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>YouTube URL</label>
          <input value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..." style={{ ...inputStyle, marginTop: 4 }} />
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
          {filtered.map(c => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", marginBottom: 4, borderRadius: 10,
              background: editingId === c.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div>
                <div style={{ color: "#E8E8E8", fontSize: 14, fontWeight: 500 }}>{c.nombre}</div>
                {c.youtube_url && (
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>{c.youtube_url}</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(c)} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Editar</button>
                <button onClick={() => setDeleteTarget(c)} style={{
                  padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 6, color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                }}>Eliminar</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#555", fontSize: 13 }}>
              {search ? 'No se encontraron cantos' : 'No hay cantos registrados'}
            </div>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar Canto"
          message={`¿Eliminar "${deleteTarget.nombre}"?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
