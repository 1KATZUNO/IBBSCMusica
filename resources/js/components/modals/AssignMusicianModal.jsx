import { useState, useEffect } from 'react';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function AssignMusicianModal({ onClose, onAssign, musicians, currentMusicos }) {
  const [musicianId, setMusicianId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedMusician = musicians.find(m => m.id === Number(musicianId));
  const availableMusicians = musicians.filter(m => m.activo);

  useEffect(() => {
    if (selectedMusician?.roles?.length > 0 && !roleId) {
      setRoleId(String(selectedMusician.roles[0].id));
    }
  }, [selectedMusician]);

  const handleAssign = async () => {
    if (!musicianId || !roleId) return;
    setSaving(true);
    try {
      await onAssign(Number(musicianId), Number(roleId));
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
          Asignar Músico
        </h3>

        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Músico</label>
        <select value={musicianId} onChange={e => { setMusicianId(e.target.value); setRoleId(''); }}
          style={{ ...inputStyle, marginTop: 4 }}>
          <option value="">Seleccionar músico...</option>
          {availableMusicians.map(m =>
            <option key={m.id} value={m.id}>{m.nombre} ({m.roles.map(r => r.nombre).join(', ')})</option>
          )}
        </select>

        {selectedMusician && (
          <>
            <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Rol para este culto</label>
            <select value={roleId} onChange={e => setRoleId(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
              {selectedMusician.roles.map(r =>
                <option key={r.id} value={r.id}>{r.nombre}</option>
              )}
            </select>
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleAssign} disabled={saving || !musicianId || !roleId} style={{
            flex: 1, padding: "10px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: (saving || !musicianId || !roleId) ? 0.5 : 1,
          }}>{saving ? 'Asignando...' : 'Asignar'}</button>
        </div>
      </div>
    </div>
  );
}
