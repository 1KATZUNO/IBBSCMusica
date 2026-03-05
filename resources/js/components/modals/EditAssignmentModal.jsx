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

export default function EditAssignmentModal({ assignment, onClose, onSave }) {
  const [nombre, setNombre] = useState(assignment.nombre || '');
  const [responsabilidades, setResponsabilidades] = useState(assignment.responsabilidades || '');
  const [observaciones, setObservaciones] = useState(assignment.observaciones || '');
  const [detalles, setDetalles] = useState(assignment.detalles || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim() || !responsabilidades.trim()) return;
    setSaving(true);
    try {
      await onSave(assignment.id, {
        nombre: nombre.trim(),
        responsabilidades: responsabilidades.trim(),
        observaciones: observaciones.trim() || null,
        detalles: detalles.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = nombre.trim() && responsabilidades.trim() && !saving;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111113", borderRadius: 16, padding: "28px",
        width: 440, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <h3 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 20px" }}>
          Editar Asignacion
        </h3>

        <label style={labelStyle}>Nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="Ej: D. Juan, D. Carlos" style={{ ...inputStyle, marginTop: 4 }} />

        <label style={labelStyle}>Responsabilidades</label>
        <textarea value={responsabilidades} onChange={e => setResponsabilidades(e.target.value)}
          rows={3} style={{ ...inputStyle, marginTop: 4, resize: "vertical" }} />

        <label style={labelStyle}>Observaciones (opcional)</label>
        <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)}
          rows={2} style={{ ...inputStyle, marginTop: 4, resize: "vertical" }} />

        <label style={labelStyle}>Detalles (opcional)</label>
        <textarea value={detalles} onChange={e => setDetalles(e.target.value)}
          rows={2} style={{ ...inputStyle, marginTop: 4, resize: "vertical" }} />

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
          }}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
}
