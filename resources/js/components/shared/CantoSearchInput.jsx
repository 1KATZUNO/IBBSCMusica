import { useState, useRef, useEffect } from 'react';

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
};

export default function CantoSearchInput({ cantos, selectedCantoId, onSelect }) {
  const selected = cantos.find(c => c.id === Number(selectedCantoId));
  const [query, setQuery] = useState(selected?.nombre || '');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const sel = cantos.find(c => c.id === Number(selectedCantoId));
    if (sel) setQuery(sel.nombre);
  }, [selectedCantoId, cantos]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = cantos.filter(c =>
    c.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onSelect('');
  };

  const handleSelect = (canto) => {
    onSelect(String(canto.id));
    setQuery(canto.nombre);
    setOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onSelect('');
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "relative" }}>
        <input
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Buscar canto..."
          style={{ ...inputStyle, paddingRight: selectedCantoId ? 32 : 12 }}
        />
        {selectedCantoId && (
          <button onClick={handleClear} style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "#888", fontSize: 16,
            cursor: "pointer", padding: "2px 4px", lineHeight: 1,
          }}>&times;</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: "auto",
        }}>
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                padding: "8px 12px", cursor: "pointer", fontSize: 14, color: "#e0e0e0",
                background: c.id === Number(selectedCantoId) ? "rgba(232,185,49,0.1)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = c.id === Number(selectedCantoId) ? "rgba(232,185,49,0.1)" : "transparent"}
            >
              {c.nombre}
            </div>
          ))}
        </div>
      )}
      {open && query && filtered.length === 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, marginTop: 4, padding: "10px 12px",
          color: "#666", fontSize: 13, fontStyle: "italic",
        }}>
          No se encontraron cantos
        </div>
      )}
    </div>
  );
}
