import { useState, useEffect } from 'react';
import api from '../../api/client';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  color: "#E8E8E8", fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box", marginBottom: 12,
};

export default function DirectorSetting({ showNotif }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings/director-name').then(({ data }) => {
      setName(data.director_name);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings/director-name', { director_name: name });
      showNotif('Director actualizado');
    } catch (e) {
      showNotif('Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        👤 Director
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Nombre del director de música por defecto</p>

      {loading ? (
        <div style={{ color: "#555" }}>Cargando...</div>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12, padding: 20,
        }}>
          <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre del Director</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Nombre del director" style={{ ...inputStyle, marginTop: 4 }} />
          <button onClick={handleSave} disabled={saving} style={{
            padding: "10px 20px", background: "rgba(255,255,255,0.12)",
            border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      )}
    </div>
  );
}
