import { useState, useEffect } from 'react';
import api from '../../api/client';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function CreateCultoModal({ onClose, onCreate }) {
  const [tipo, setTipo] = useState("Domingo AM");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState("9:00 AM");
  const [directorId, setDirectorId] = useState('');
  const [directors, setDirectors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/directors').then(({ data }) => {
      const active = data.filter(d => d.activo);
      setDirectors(active);
      if (active.length > 0) setDirectorId(active[0].id);
    });
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await onCreate({ tipo, fecha, hora, director_id: directorId || null });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111113", borderRadius: 16, padding: "28px",
        width: 380, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 20px" }}>
          Crear Nuevo Culto
        </h3>
        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Tipo de culto</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          {["Domingo AM", "Domingo PM", "Miercoles", "Viernes", "Sabado", "Especial"].map(t =>
            <option key={t} value={t}>{t}</option>)}
        </select>
        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Hora</label>
        <input value={hora} onChange={e => setHora(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Director</label>
        <select value={directorId} onChange={e => setDirectorId(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          <option value="">Sin director</option>
          {directors.map(d =>
            <option key={d.id} value={d.id}>{d.nombre}</option>)}
        </select>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleCreate} disabled={saving} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.12)",
            border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Creando...' : 'Crear'}</button>
        </div>
      </div>
    </div>
  );
}
