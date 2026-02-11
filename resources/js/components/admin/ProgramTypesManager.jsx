import { useState, useEffect } from 'react';
import api from '../../api/client';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

const COLOR_PRESETS = [
  { label: 'Dorado', value: 'rgba(232,185,49,0.1)', solid: '#E8B931' },
  { label: 'Verde', value: 'rgba(107,143,113,0.1)', solid: '#6B8F71' },
  { label: 'Rojo', value: 'rgba(181,99,87,0.1)', solid: '#B56357' },
  { label: 'Morado', value: 'rgba(123,107,157,0.1)', solid: '#7B6B9D' },
  { label: 'Azul', value: 'rgba(92,134,163,0.1)', solid: '#5C86A3' },
  { label: 'Rosa', value: 'rgba(200,120,160,0.1)', solid: '#C878A0' },
  { label: 'Naranja', value: 'rgba(210,140,70,0.1)', solid: '#D28C46' },
  { label: 'Gris', value: 'rgba(255,255,255,0.1)', solid: '#888888' },
];

export default function ProgramTypesManager({ showNotif }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ slug: '', label: '', emoji: '', bg_color: COLOR_PRESETS[0].value, requires_canto: false });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/program-item-types');
      setTypes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTypes(); }, []);

  const startNew = () => {
    setEditingId('new');
    setForm({ slug: '', label: '', emoji: '', bg_color: COLOR_PRESETS[0].value, requires_canto: false });
  };

  const startEdit = (type) => {
    setEditingId(type.id);
    setForm({ slug: type.slug, label: type.label, emoji: type.emoji, bg_color: type.bg_color, requires_canto: type.requires_canto });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.label || !form.emoji) {
      showNotif('Label y emoji son requeridos', 'error');
      return;
    }
    const slug = form.slug || form.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSaving(true);
    try {
      if (editingId === 'new') {
        const { data } = await api.post('/program-item-types', { ...form, slug });
        setTypes(prev => [...prev, data]);
        showNotif('Tipo creado');
      } else {
        const { data } = await api.put(`/program-item-types/${editingId}`, { ...form, slug });
        setTypes(prev => prev.map(t => t.id === editingId ? data : t));
        showNotif('Tipo actualizado');
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
      await api.delete(`/program-item-types/${deleteTarget.id}`);
      setTypes(prev => prev.filter(t => t.id !== deleteTarget.id));
      showNotif('Tipo eliminado');
      setDeleteTarget(null);
    } catch (e) {
      showNotif(e.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  const findPresetSolid = (bgColor) => {
    const preset = COLOR_PRESETS.find(p => p.value === bgColor);
    return preset?.solid || '#888';
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        📋 Tipos de Programa
      </h2>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>Los tipos del sistema no se pueden modificar ni eliminar</p>

      <button onClick={startNew} style={{
        padding: "10px 16px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
        border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
        fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
      }}>+ Nuevo Tipo</button>

      {/* Form */}
      {editingId && (
        <div style={{
          background: "rgba(232,185,49,0.05)", border: "1px solid rgba(232,185,49,0.15)",
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre</label>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ej: Testimonio" style={{ ...inputStyle, marginTop: 4 }} />
            </div>
            <div style={{ width: 80 }}>
              <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Emoji</label>
              <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                placeholder="🎵" style={{ ...inputStyle, marginTop: 4, textAlign: "center" }} />
            </div>
          </div>

          <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>
            Color
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {COLOR_PRESETS.map(preset => (
              <button key={preset.value} onClick={() => setForm(f => ({ ...f, bg_color: preset.value }))}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 20, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  background: form.bg_color === preset.value ? preset.value : "rgba(255,255,255,0.03)",
                  border: form.bg_color === preset.value
                    ? `2px solid ${preset.solid}`
                    : "1px solid rgba(255,255,255,0.08)",
                  color: form.bg_color === preset.value ? preset.solid : "#888",
                  fontWeight: form.bg_color === preset.value ? 700 : 400,
                }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: preset.solid,
                }} />
                {preset.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: 8, marginBottom: 14,
            background: form.bg_color || 'rgba(255,255,255,0.03)',
            borderLeft: `3px solid ${findPresetSolid(form.bg_color)}`,
          }}>
            <span style={{ fontSize: 16 }}>{form.emoji || '?'}</span>
            <span style={{ color: findPresetSolid(form.bg_color), fontSize: 13, fontWeight: 600 }}>
              {form.label || 'Vista previa'}
            </span>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#999", fontSize: 13, marginBottom: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={form.requires_canto}
              onChange={e => setForm(f => ({ ...f, requires_canto: e.target.checked }))} />
            Requiere seleccionar un canto
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={cancelEdit} style={{
              padding: "8px 16px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "8px 16px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
              border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 12,
              fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
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
          {types.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", marginBottom: 4, borderRadius: 10,
              background: t.bg_color || "rgba(255,255,255,0.02)",
              borderLeft: `3px solid ${findPresetSolid(t.bg_color)}`,
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <div>
                  <div style={{ color: "#e0e0e0", fontSize: 14, fontWeight: 500 }}>{t.label}</div>
                  <div style={{ color: "#666", fontSize: 11 }}>
                    {t.requires_canto ? 'Con canto' : 'Sin canto'}
                    {t.is_system && <span style={{ color: "#E8B931" }}> · sistema</span>}
                  </div>
                </div>
              </div>
              {!t.is_system && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(t)} style={{
                    padding: "4px 10px", background: "rgba(232,185,49,0.1)", border: "1px solid rgba(232,185,49,0.2)",
                    borderRadius: 6, color: "#E8B931", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Editar</button>
                  <button onClick={() => setDeleteTarget(t)} style={{
                    padding: "4px 10px", background: "rgba(181,99,87,0.1)", border: "1px solid rgba(181,99,87,0.2)",
                    borderRadius: 6, color: "#B56357", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar Tipo"
          message={`¿Eliminar "${deleteTarget.label}"?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
