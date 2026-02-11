import { useState, useEffect } from 'react';
import api from '../../api/client';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
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
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#f0f0f0", marginBottom: 6 }}>
        👤 Director
      </h2>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>Nombre del director de música por defecto</p>

      {loading ? (
        <div style={{ color: "#555" }}>Cargando...</div>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12, padding: 20,
        }}>
          <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Nombre del Director</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Nombre del director" style={{ ...inputStyle, marginTop: 4 }} />
          <button onClick={handleSave} disabled={saving} style={{
            padding: "10px 20px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      )}
    </div>
  );
}
