import { useState } from 'react';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function EditItemModal({ item, onClose, onSave, cantos, programItemTypes }) {
  const [typeId, setTypeId] = useState(String(programItemTypes.find(t => t.slug === item.tipo)?.id || ''));
  const [cantoId, setCantoId] = useState(String(item.canto?.id || ''));
  const [responsable, setResponsable] = useState(item.responsable || '');
  const [titulo, setTitulo] = useState(item.titulo || '');
  const [saving, setSaving] = useState(false);

  const selectedType = programItemTypes.find(t => t.id === Number(typeId));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(item.id, {
        program_item_type_id: Number(typeId),
        canto_id: selectedType?.requires_canto ? Number(cantoId) : null,
        responsable: !selectedType?.requires_canto ? responsable || null : null,
        titulo: !selectedType?.requires_canto ? titulo || null : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#222", borderRadius: 16, padding: "28px",
        width: 400, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#E8B931", fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 20px" }}>
          Editar Item
        </h3>
        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Tipo</label>
        <select value={typeId} onChange={e => setTypeId(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          {programItemTypes.map(t =>
            <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
        </select>

        {selectedType?.requires_canto ? (
          <>
            <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Seleccionar canto</label>
            <select value={cantoId} onChange={e => setCantoId(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
              {cantos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </>
        ) : (
          <>
            <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Responsable</label>
            <input value={responsable} onChange={e => setResponsable(e.target.value)}
              placeholder="Ej: Hno. Carlos" style={{ ...inputStyle, marginTop: 4 }} />
            {selectedType?.slug === 'leccion' && (
              <>
                <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Título</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej: La fe que transforma" style={{ ...inputStyle, marginTop: 4 }} />
              </>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "10px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
}
