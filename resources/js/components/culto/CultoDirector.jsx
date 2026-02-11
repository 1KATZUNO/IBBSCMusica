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
      marginBottom: 20, animation: "fadeSlideIn 0.5s ease 0.15s both",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg, #E8B931, #B56357)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700,
      }}>{directorName?.[0] || 'D'}</div>
      <div style={{ flex: 1 }}>
        <span style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
          Director:
        </span>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{
              padding: "4px 8px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
              color: "#e0e0e0", fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif",
            }}>
              <option value="">Sin director</option>
              {directors.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "3px 10px", background: "rgba(232,185,49,0.15)",
              border: "1px solid rgba(232,185,49,0.3)", borderRadius: 6,
              color: "#E8B931", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>{saving ? '...' : 'OK'}</button>
            <button onClick={() => { setEditing(false); setSelectedId(directorId || ''); }} style={{
              padding: "3px 8px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
              color: "#888", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>X</button>
          </div>
        ) : (
          <span style={{ color: "#bbb", fontSize: 13, marginLeft: 6 }}>
            {directorName || 'Sin asignar'}
            {isAdmin && (
              <button onClick={() => setEditing(true)} style={{
                marginLeft: 8, padding: "2px 8px", background: "rgba(232,185,49,0.08)",
                border: "1px solid rgba(232,185,49,0.15)", borderRadius: 4,
                color: "#E8B931", fontSize: 9, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Cambiar</button>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
