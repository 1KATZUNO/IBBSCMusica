import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';

export default function CultoDirector({ directorName, directorId, cultoId, onDirectorChanged }) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [selectedId, setSelectedId] = useState(directorId || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing && directors.length === 0) {
      api.get('/directors').then(({ data }) => {
        setDirectors(data.filter(d => d.activo));
      });
    }
  }, [editing]);

  useEffect(() => {
    setSelectedId(directorId || '');
    setEditing(false);
  }, [directorId, cultoId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/cultos/${cultoId}`, { director_id: selectedId || null });
      if (onDirectorChanged) onDirectorChanged();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 24px 20px",
      animation: "fadeUp 0.5s ease 0.35s both",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase", letterSpacing: 2, flexShrink: 0,
      }}>Director:</div>
      <div style={{ flex: 1 }}>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{
              padding: "5px 10px", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              color: "#E8E8E8", fontSize: 12, outline: "none", fontFamily: "'Outfit', sans-serif",
            }}>
              <option value="">Sin director</option>
              {directors.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
            <button onClick={handleSave} disabled={saving} className="action-btn" style={{
              padding: "4px 12px", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6,
              color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
            }}>{saving ? '...' : 'OK'}</button>
            <button onClick={() => { setEditing(false); setSelectedId(directorId || ''); }} style={{
              padding: "4px 10px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
              color: "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>X</button>
          </div>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            {directorName || 'Sin asignar'}
            {isAdmin && (
              <button onClick={() => setEditing(true)} className="action-btn" style={{
                marginLeft: 8, padding: "2px 10px", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                color: "rgba(255,255,255,0.4)", fontSize: 9, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}>Cambiar</button>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
