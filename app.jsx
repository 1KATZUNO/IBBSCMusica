import { useState, useEffect, useRef } from "react";

const YOUTUBE_ICON = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const MOCK_CANTOS = [
  { id: 1, nombre: "Grande es tu fidelidad", youtube: "https://youtube.com/watch?v=example1" },
  { id: 2, nombre: "Tu amor no se rinde", youtube: "https://youtube.com/watch?v=example2" },
  { id: 3, nombre: "Aquí estoy", youtube: "https://youtube.com/watch?v=example3" },
  { id: 4, nombre: "Renuévame", youtube: "https://youtube.com/watch?v=example4" },
  { id: 5, nombre: "Al que está sentado en el trono", youtube: "https://youtube.com/watch?v=example5" },
  { id: 6, nombre: "Santo, Santo, Santo", youtube: "https://youtube.com/watch?v=example6" },
  { id: 7, nombre: "Dios incomparable", youtube: "https://youtube.com/watch?v=example7" },
  { id: 8, nombre: "Gracia sublime", youtube: "https://youtube.com/watch?v=example8" },
];

const MOCK_CULTOS = [
  {
    id: 1,
    tipo: "Domingo AM",
    fecha: "2026-02-15",
    hora: "9:00 AM",
    color: "#E8B931",
    programa: [
      { tipo: "canto", canto: MOCK_CANTOS[0], orden: 1 },
      { tipo: "canto", canto: MOCK_CANTOS[1], orden: 2 },
      { tipo: "bienvenida", responsable: "Hno. Carlos", orden: 3 },
      { tipo: "oracion", responsable: "Hna. María", orden: 4 },
      { tipo: "canto", canto: MOCK_CANTOS[2], orden: 5 },
      { tipo: "canto", canto: MOCK_CANTOS[3], orden: 6 },
      { tipo: "canto", canto: MOCK_CANTOS[4], orden: 7 },
      { tipo: "anuncios", responsable: "Hno. Pedro", orden: 8 },
      { tipo: "leccion", responsable: "Pastor Juan", titulo: "La fe que transforma", orden: 9 },
      { tipo: "ofrendas", responsable: "Hno. Luis", orden: 10 },
      { tipo: "canto", canto: MOCK_CANTOS[5], orden: 11 },
    ],
    musicos: ["David (Guitarra)", "Ana (Teclado)", "Carlos (Bajo)", "María (Voz)"],
    director: "David",
  },
  {
    id: 2,
    tipo: "Miércoles",
    fecha: "2026-02-18",
    hora: "7:00 PM",
    color: "#6B8F71",
    programa: [
      { tipo: "canto", canto: MOCK_CANTOS[6], orden: 1 },
      { tipo: "canto", canto: MOCK_CANTOS[7], orden: 2 },
      { tipo: "oracion", responsable: "Hno. Roberto", orden: 3 },
      { tipo: "canto", canto: MOCK_CANTOS[3], orden: 4 },
      { tipo: "leccion", responsable: "Pastor Juan", titulo: "Estudio bíblico: Romanos 8", orden: 5 },
      { tipo: "ofrendas", responsable: "Hna. Elena", orden: 6 },
      { tipo: "canto", canto: MOCK_CANTOS[0], orden: 7 },
    ],
    musicos: ["David (Guitarra)", "Elena (Teclado)"],
    director: "David",
  },
  {
    id: 3,
    tipo: "Viernes",
    fecha: "2026-02-20",
    hora: "7:30 PM",
    color: "#B56357",
    programa: [
      { tipo: "canto", canto: MOCK_CANTOS[1], orden: 1 },
      { tipo: "canto", canto: MOCK_CANTOS[4], orden: 2 },
      { tipo: "canto", canto: MOCK_CANTOS[5], orden: 3 },
      { tipo: "bienvenida", responsable: "Hna. Sofía", orden: 4 },
      { tipo: "oracion", responsable: "Hno. Marcos", orden: 5 },
      { tipo: "canto", canto: MOCK_CANTOS[2], orden: 6 },
      { tipo: "canto", canto: MOCK_CANTOS[6], orden: 7 },
      { tipo: "anuncios", responsable: "Hno. Pedro", orden: 8 },
      { tipo: "leccion", responsable: "Hna. Laura", titulo: "Jóvenes con propósito", orden: 9 },
      { tipo: "ofrendas", responsable: "Hno. Carlos", orden: 10 },
      { tipo: "canto", canto: MOCK_CANTOS[7], orden: 11 },
    ],
    musicos: ["Ana (Guitarra)", "Roberto (Bajo)", "Sofía (Voz)", "David (Teclado)"],
    director: "David",
  },
  {
    id: 4,
    tipo: "Domingo PM",
    fecha: "2026-02-15",
    hora: "5:00 PM",
    color: "#7B6B9D",
    programa: [
      { tipo: "canto", canto: MOCK_CANTOS[3], orden: 1 },
      { tipo: "canto", canto: MOCK_CANTOS[7], orden: 2 },
      { tipo: "oracion", responsable: "Hno. Felipe", orden: 3 },
      { tipo: "canto", canto: MOCK_CANTOS[0], orden: 4 },
      { tipo: "leccion", responsable: "Pastor Juan", titulo: "Adoración verdadera", orden: 5 },
      { tipo: "ofrendas", responsable: "Hna. María", orden: 6 },
      { tipo: "canto", canto: MOCK_CANTOS[5], orden: 7 },
    ],
    musicos: ["Carlos (Guitarra)", "María (Voz)", "Luis (Batería)"],
    director: "David",
  },
];

const TIPO_CONFIG = {
  canto: { emoji: "🎵", label: "Canto", bg: "rgba(232,185,49,0.1)" },
  bienvenida: { emoji: "👋", label: "Bienvenida", bg: "rgba(107,143,113,0.1)" },
  oracion: { emoji: "🙏", label: "Oración", bg: "rgba(181,99,87,0.1)" },
  anuncios: { emoji: "📢", label: "Anuncios", bg: "rgba(123,107,157,0.1)" },
  leccion: { emoji: "📖", label: "Lección / Prédica", bg: "rgba(92,134,163,0.1)" },
  ofrendas: { emoji: "💛", label: "Ofrendas", bg: "rgba(232,185,49,0.1)" },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]}`;
};

// ─── Sidebar ───
function Sidebar({ isOpen, onClose, isLoggedIn, onLogin, onLogout, cultos, selectedCulto, onSelectCulto, onCreateCulto }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      {isOpen && <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90,
        backdropFilter: "blur(4px)", transition: "opacity 0.3s"
      }} />}
      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : -340, width: 320,
        height: "100vh", background: "#1a1a1a", zIndex: 100,
        transition: "left 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#E8B931", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
              ♪ Ministerio Música
            </span>
            <button onClick={onClose} style={{
              background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer"
            }}>✕</button>
          </div>
        </div>

        {/* Cultos list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, padding: "8px", marginBottom: 4 }}>
            Próximos Cultos
          </div>
          {cultos.map(c => (
            <button key={c.id} onClick={() => { onSelectCulto(c.id); onClose(); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: selectedCulto === c.id ? "rgba(232,185,49,0.1)" : "transparent",
                border: selectedCulto === c.id ? "1px solid rgba(232,185,49,0.2)" : "1px solid transparent",
                borderRadius: 10, padding: "12px 14px", marginBottom: 4, cursor: "pointer",
                transition: "all 0.2s",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0
                }} />
                <div>
                  <div style={{ color: "#e0e0e0", fontSize: 14, fontWeight: 600 }}>{c.tipo}</div>
                  <div style={{ color: "#777", fontSize: 12, marginTop: 2 }}>{formatDate(c.fecha)} · {c.hora}</div>
                </div>
              </div>
            </button>
          ))}

          {isLoggedIn && (
            <button onClick={onCreateCulto} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "12px", marginTop: 8,
              background: "rgba(232,185,49,0.08)", border: "1px dashed rgba(232,185,49,0.3)",
              borderRadius: 10, color: "#E8B931", fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            }}>
              + Crear nuevo culto
            </button>
          )}
        </div>

        {/* Login section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
          {isLoggedIn ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #E8B931, #B56357)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, fontWeight: 700
                }}>D</div>
                <div>
                  <div style={{ color: "#e0e0e0", fontSize: 13, fontWeight: 600 }}>Director de Música</div>
                  <div style={{ color: "#666", fontSize: 11 }}>Modo edición activo</div>
                </div>
              </div>
              <button onClick={onLogout} style={{
                width: "100%", padding: "8px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
                🔒 Acceso Director
              </div>
              <input value={user} onChange={e => setUser(e.target.value)}
                placeholder="Usuario" style={{
                  width: "100%", padding: "9px 12px", marginBottom: 6,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e0e0e0", fontSize: 13, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                }} />
              <input value={pass} onChange={e => setPass(e.target.value)}
                type="password" placeholder="Contraseña" style={{
                  width: "100%", padding: "9px 12px", marginBottom: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e0e0e0", fontSize: 13, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                }} />
              <button onClick={() => { onLogin(); setUser(""); setPass(""); }} style={{
                width: "100%", padding: "10px",
                background: "linear-gradient(135deg, #E8B931, #d4a72a)",
                border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Program Item ───
function ProgramItem({ item, index, isEditing, onEdit, onRemove }) {
  const config = TIPO_CONFIG[item.tipo] || { emoji: "•", label: item.tipo, bg: "rgba(255,255,255,0.03)" };

  return (
    <div style={{
      display: "flex", alignItems: "stretch", gap: 0, marginBottom: 2,
      animation: `fadeSlideIn 0.4s ease ${index * 0.05}s both`,
    }}>
      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: config.bg, border: `1.5px solid rgba(255,255,255,0.08)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, flexShrink: 0,
        }}>{config.emoji}</div>
        <div style={{ flex: 1, width: 1.5, background: "rgba(255,255,255,0.05)", minHeight: 12 }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, padding: "4px 14px 16px",
        borderRadius: 10, marginLeft: 4,
      }}>
        <div style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
          {config.label}
        </div>
        {item.tipo === "canto" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e0e0e0", fontSize: 15, fontWeight: 500 }}>{item.canto?.nombre}</span>
            {item.canto?.youtube && (
              <a href={item.canto.youtube} target="_blank" rel="noopener noreferrer"
                style={{ color: "#ff4444", opacity: 0.7, transition: "opacity 0.2s", display: "flex" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                <YOUTUBE_ICON />
              </a>
            )}
          </div>
        ) : (
          <div>
            {item.titulo && <div style={{ color: "#e0e0e0", fontSize: 15, fontWeight: 500 }}>{item.titulo}</div>}
            {item.responsable && <div style={{ color: "#999", fontSize: 13, marginTop: 2 }}>{item.responsable}</div>}
          </div>
        )}

        {isEditing && (
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <button onClick={onEdit} style={{
              padding: "4px 10px", background: "rgba(232,185,49,0.1)", border: "1px solid rgba(232,185,49,0.2)",
              borderRadius: 6, color: "#E8B931", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Editar</button>
            <button onClick={onRemove} style={{
              padding: "4px 10px", background: "rgba(181,99,87,0.1)", border: "1px solid rgba(181,99,87,0.2)",
              borderRadius: 6, color: "#B56357", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Quitar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Create Culto Modal ───
function CreateCultoModal({ onClose, onCreate }) {
  const [tipo, setTipo] = useState("Domingo AM");
  const [fecha, setFecha] = useState("2026-02-22");
  const [hora, setHora] = useState("9:00 AM");

  const inputStyle = {
    width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#222", borderRadius: 16, padding: "28px",
        width: 380, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#E8B931", fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 20px" }}>
          Crear Nuevo Culto
        </h3>
        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Tipo de culto</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          {["Domingo AM", "Domingo PM", "Miércoles", "Viernes", "Sábado", "Especial"].map(t =>
            <option key={t} value={t}>{t}</option>)}
        </select>
        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Hora</label>
        <input value={hora} onChange={e => setHora(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={() => onCreate({ tipo, fecha, hora })} style={{
            flex: 1, padding: "10px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Crear</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Item Modal ───
function AddItemModal({ onClose, onAdd }) {
  const [tipo, setTipo] = useState("canto");
  const [cantoId, setCantoId] = useState(1);
  const [responsable, setResponsable] = useState("");
  const [titulo, setTitulo] = useState("");

  const inputStyle = {
    width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    color: "#e0e0e0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", marginBottom: 12,
  };

  const handleAdd = () => {
    if (tipo === "canto") {
      const canto = MOCK_CANTOS.find(c => c.id === cantoId);
      onAdd({ tipo: "canto", canto, orden: 99 });
    } else {
      onAdd({ tipo, responsable, titulo: titulo || undefined, orden: 99 });
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
          Agregar al Programa
        </h3>
        <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Tipo</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, marginTop: 4 }}>
          {Object.entries(TIPO_CONFIG).map(([k, v]) =>
            <option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </select>

        {tipo === "canto" ? (
          <>
            <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Seleccionar canto</label>
            <select value={cantoId} onChange={e => setCantoId(Number(e.target.value))} style={{ ...inputStyle, marginTop: 4 }}>
              {MOCK_CANTOS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </>
        ) : (
          <>
            <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Responsable</label>
            <input value={responsable} onChange={e => setResponsable(e.target.value)}
              placeholder="Ej: Hno. Carlos" style={{ ...inputStyle, marginTop: 4 }} />
            {(tipo === "leccion") && (
              <>
                <label style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Título</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej: La fe que transforma" style={{ ...inputStyle, marginTop: 4 }} />
              </>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleAdd} style={{
            flex: 1, padding: "10px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Agregar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCultoId, setSelectedCultoId] = useState(1);
  const [cultos, setCultos] = useState(MOCK_CULTOS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const culto = cultos.find(c => c.id === selectedCultoId);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCreateCulto = ({ tipo, fecha, hora }) => {
    const colors = ["#E8B931", "#6B8F71", "#B56357", "#7B6B9D", "#5C86A3"];
    const newCulto = {
      id: Date.now(),
      tipo, fecha, hora,
      color: colors[Math.floor(Math.random() * colors.length)],
      programa: [],
      musicos: [],
      director: "David",
    };
    setCultos(prev => [...prev, newCulto]);
    setSelectedCultoId(newCulto.id);
    setShowCreateModal(false);
    showNotif(`Culto "${tipo}" creado`);
  };

  const handleAddItem = (item) => {
    setCultos(prev => prev.map(c =>
      c.id === selectedCultoId
        ? { ...c, programa: [...c.programa, { ...item, orden: c.programa.length + 1 }] }
        : c
    ));
    setShowAddItemModal(false);
    showNotif("Item agregado al programa");
  };

  const handleRemoveItem = (index) => {
    setCultos(prev => prev.map(c =>
      c.id === selectedCultoId
        ? { ...c, programa: c.programa.filter((_, i) => i !== index) }
        : c
    ));
    showNotif("Item removido");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e0e0e0",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notifIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        select option { background: #222; color: #e0e0e0; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 300,
          background: "#E8B931", color: "#1a1a1a", padding: "10px 24px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, animation: "notifIn 0.3s ease",
          boxShadow: "0 4px 20px rgba(232,185,49,0.3)",
        }}>{notification}</div>
      )}

      <Sidebar
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogin={() => { setIsLoggedIn(true); showNotif("Sesión iniciada como Director"); }}
        onLogout={() => { setIsLoggedIn(false); showNotif("Sesión cerrada"); }}
        cultos={cultos} selectedCulto={selectedCultoId}
        onSelectCulto={setSelectedCultoId}
        onCreateCulto={() => setShowCreateModal(true)}
      />

      {showCreateModal && <CreateCultoModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateCulto} />}
      {showAddItemModal && <AddItemModal onClose={() => setShowAddItemModal(false)} onAdd={handleAddItem} />}

      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(17,17,17,0.95)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            background: "none", border: "none", color: "#e0e0e0", fontSize: 20, cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 4, padding: 4,
          }}>
            <div style={{ width: 20, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
            <div style={{ width: 15, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
            <div style={{ width: 20, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#E8B931" }}>
            ♪ Programa de Culto
          </span>
        </div>
        {isLoggedIn && (
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #E8B931, #B56357)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 700,
          }}>D</div>
        )}
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 80px" }}>
        {culto ? (
          <>
            {/* Culto header */}
            <div style={{
              marginBottom: 28,
              animation: "fadeSlideIn 0.5s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: culto.color }} />
                <span style={{
                  color: culto.color, fontSize: 12, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: 1.5,
                }}>{culto.tipo}</span>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
                color: "#f0f0f0", lineHeight: 1.2, marginBottom: 6,
              }}>
                {formatDate(culto.fecha)}
              </h1>
              <div style={{ color: "#666", fontSize: 14 }}>{culto.hora} · {culto.programa.length} items en el programa</div>
            </div>

            {/* Músicos */}
            <div style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.05)", padding: "16px 18px",
              marginBottom: 28, animation: "fadeSlideIn 0.5s ease 0.1s both",
            }}>
              <div style={{
                color: "#888", fontSize: 10, textTransform: "uppercase",
                letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
              }}>🎸 Músicos</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {culto.musicos.map((m, i) => (
                  <span key={i} style={{
                    padding: "5px 12px", background: "rgba(255,255,255,0.04)",
                    borderRadius: 20, fontSize: 12, color: "#bbb",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>{m}</span>
                ))}
                {culto.musicos.length === 0 && (
                  <span style={{ color: "#555", fontSize: 13, fontStyle: "italic" }}>
                    No hay músicos asignados aún
                  </span>
                )}
              </div>
              {isLoggedIn && (
                <button style={{
                  marginTop: 10, padding: "5px 12px", background: "rgba(232,185,49,0.08)",
                  border: "1px dashed rgba(232,185,49,0.25)", borderRadius: 20,
                  color: "#E8B931", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>+ Agregar músico</button>
              )}
            </div>

            {/* Director */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 20, animation: "fadeSlideIn 0.5s ease 0.15s both",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #E8B931, #B56357)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700,
              }}>D</div>
              <div>
                <span style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                  Director:
                </span>
                <span style={{ color: "#bbb", fontSize: 13, marginLeft: 6 }}>{culto.director}</span>
              </div>
            </div>

            {/* Programa header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16, animation: "fadeSlideIn 0.5s ease 0.2s both",
            }}>
              <div style={{
                color: "#888", fontSize: 10, textTransform: "uppercase",
                letterSpacing: 1.5, fontWeight: 600,
              }}>📋 Orden del Programa</div>
              {isLoggedIn && (
                <button onClick={() => setShowAddItemModal(true)} style={{
                  padding: "6px 14px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
                  border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 12,
                  fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>+ Agregar</button>
              )}
            </div>

            {/* Programa items */}
            <div style={{ animation: "fadeSlideIn 0.5s ease 0.25s both" }}>
              {culto.programa.map((item, i) => (
                <ProgramItem
                  key={i} item={item} index={i}
                  isEditing={isLoggedIn}
                  onEdit={() => showNotif("Modal de edición (próximamente)")}
                  onRemove={() => handleRemoveItem(i)}
                />
              ))}
              {culto.programa.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "40px 20px", color: "#555",
                  fontSize: 14, fontStyle: "italic",
                }}>
                  Este programa está vacío. {isLoggedIn ? "Haz clic en '+ Agregar' para comenzar." : ""}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
            Selecciona un culto del panel lateral
          </div>
        )}
      </main>

      {/* Footer hint */}
      {!isLoggedIn && (
        <div style={{
          position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
          color: "#444", fontSize: 11, textAlign: "center",
          animation: "fadeSlideIn 1s ease 0.5s both",
        }}>
          ← Abre el panel lateral para ver más cultos o iniciar sesión
        </div>
      )}
    </div>
  );
}
