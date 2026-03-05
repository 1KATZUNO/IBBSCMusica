import { useState } from 'react';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

const labelStyle = {
  color: "rgba(255,255,255,0.35)", fontSize: 11,
  textTransform: "uppercase", letterSpacing: 1.5,
};

export default function ReunionModal({ reunion, onClose, onSave }) {
  const isEdit = !!reunion;
  const [descripcion, setDescripcion] = useState(reunion?.descripcion || '');
  const [hora, setHora] = useState(reunion?.hora || '');
  const [lugar, setLugar] = useState(reunion?.lugar || '');
  const [asistentes, setAsistentes] = useState(reunion?.asistentes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!descripcion.trim()) return;
    setSaving(true);
    try {
      await onSave({
        descripcion: descripcion.trim(),
        hora: hora.trim() || null,
        lugar: lugar.trim() || null,
        asistentes: asistentes.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = descripcion.trim() && !saving;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111113", borderRadius: 16, padding: "28px",
        width: 420, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 20px" }}>
          {isEdit ? 'Editar Reunion' : 'Nueva Reunion'}
        </h3>

        <label style={labelStyle}>Descripcion</label>
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)}
          placeholder="Ej: Clase de Sabiduria (Oracion y directrices)" style={{ ...inputStyle, marginTop: 4 }} />

        <label style={labelStyle}>Hora</label>
        <input value={hora} onChange={e => setHora(e.target.value)}
          placeholder="Ej: 09:15" style={{ ...inputStyle, marginTop: 4 }} />

        <label style={labelStyle}>Lugar</label>
        <input value={lugar} onChange={e => setLugar(e.target.value)}
          placeholder="Ej: Salon principal" style={{ ...inputStyle, marginTop: 4 }} />

        <label style={labelStyle}>Asistentes</label>
        <textarea value={asistentes} onChange={e => setAsistentes(e.target.value)}
          placeholder="Ej: Todos los ujieres y nosotros" rows={2}
          style={{ ...inputStyle, marginTop: 4, resize: "vertical" }} />

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={!canSubmit} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.12)",
            border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            opacity: canSubmit ? 1 : 0.5,
          }}>{saving ? 'Guardando...' : (isEdit ? 'Guardar' : 'Crear')}</button>
        </div>
      </div>
    </div>
  );
}
