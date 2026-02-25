import { useState, useEffect } from 'react';
import CantoSearchInput from '../shared/CantoSearchInput';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function AddItemModal({ onClose, onAdd, cantos, programItemTypes }) {
  const [typeId, setTypeId] = useState('');
  const [cantoId, setCantoId] = useState('');
  const [responsable, setResponsable] = useState('');
  const [titulo, setTitulo] = useState('');
  const [duracion, setDuracion] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedType = programItemTypes.find(t => t.id === Number(typeId));

  useEffect(() => {
    if (programItemTypes.length > 0 && !typeId) {
      setTypeId(String(programItemTypes[0].id));
    }
  }, [programItemTypes]);

  const handleAdd = async () => {
    setSaving(true);
    try {
      await onAdd({
        program_item_type_id: Number(typeId),
        canto_id: selectedType?.requires_canto && cantoId ? Number(cantoId) : null,
        responsable: !selectedType?.requires_canto ? responsable || null : null,
        titulo: !selectedType?.requires_canto ? titulo || null : null,
        duracion: duracion ? Number(duracion) : null,
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
        background: "#111113", borderRadius: 16, padding: "28px",
        width: 400, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 20px" }}>
          Agregar al Programa
        </h3>
        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Tipo</label>
        <select value={typeId} onChange={e => setTypeId(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          {programItemTypes.map(t =>
            <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
        </select>

        {selectedType?.requires_canto ? (
          <>
            <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Buscar canto</label>
            <div style={{ marginTop: 4 }}>
              <CantoSearchInput cantos={cantos} selectedCantoId={cantoId} onSelect={setCantoId} />
            </div>
          </>
        ) : (
          <>
            <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Responsable</label>
            <input value={responsable} onChange={e => setResponsable(e.target.value)}
              placeholder="Ej: Hno. Carlos" style={{ ...inputStyle, marginTop: 4 }} />
            <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Titulo (opcional)</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: La fe que transforma" style={{ ...inputStyle, marginTop: 4 }} />
          </>
        )}

        <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Duracion (minutos)</label>
        <input type="number" min="1" max="120" value={duracion} onChange={e => setDuracion(e.target.value)}
          placeholder="Ej: 5" style={{ ...inputStyle, marginTop: 4 }} />

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleAdd} disabled={saving} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.12)",
            border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Agregando...' : 'Agregar'}</button>
        </div>
      </div>
    </div>
  );
}
