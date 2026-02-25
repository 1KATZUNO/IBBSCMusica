import { useAuth } from '../../hooks/useAuth';
import ProgramItem from './ProgramItem';

function hexToRgb(hex) {
  const m = (hex || '#888888').replace("#", "").match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [100, 100, 100];
}

export default function ProgramList({
  programa, onAddItem, onEditItem, onRemoveItem, onMoveUp, onMoveDown,
  isLive, activeItemId, getItemElapsedSeconds, onCompleteItem, onUncompleteItem,
  cultoColor,
}) {
  const { isAdmin } = useAuth();
  const [cr, cg, cb] = hexToRgb(cultoColor);

  return (
    <div style={{ padding: "24px 24px 0" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16,
        animation: "fadeUp 0.5s ease 0.4s both",
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase", letterSpacing: 3,
        }}>Programa</div>
        {isAdmin && !isLive && (
          <button onClick={onAddItem} className="action-btn" style={{
            padding: "7px 18px",
            background: `rgba(${cr},${cg},${cb},0.15)`,
            border: `1px solid rgba(${cr},${cg},${cb},0.25)`,
            borderRadius: 20, color: cultoColor || '#6C5CE7', fontSize: 11,
            fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
          }}>+ Agregar</button>
        )}
      </div>

      {/* Column header */}
      <div style={{
        display: "grid", gridTemplateColumns: "32px 1fr 50px 40px",
        padding: "0 8px 8px", gap: 12,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        marginBottom: 4,
        animation: "fadeUp 0.5s ease 0.42s both",
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>#</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>TITULO</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "right" }}>MIN</div>
        <div />
      </div>

      {/* Items */}
      <div style={{ animation: "fadeUp 0.5s ease 0.45s both" }}>
        {programa?.map((item, i) => (
          <ProgramItem
            key={item.id}
            item={item}
            index={i}
            isFirst={i === 0}
            isLast={i === programa.length - 1}
            onEdit={() => onEditItem(item)}
            onRemove={() => onRemoveItem(item.id)}
            onMoveUp={() => onMoveUp(i)}
            onMoveDown={() => onMoveDown(i)}
            isLive={isLive}
            isActive={item.id === activeItemId}
            isCompleted={!!item.completed_at}
            itemElapsedSeconds={getItemElapsedSeconds ? getItemElapsedSeconds(item) : 0}
            onComplete={() => onCompleteItem && onCompleteItem(item.id)}
            onUncomplete={() => onUncompleteItem && onUncompleteItem(item.id)}
          />
        ))}
        {(!programa || programa.length === 0) && (
          <div style={{
            textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.25)",
            fontSize: 14,
          }}>
            Este programa esta vacio. {isAdmin ? "Haz clic en '+ Agregar' para comenzar." : ""}
          </div>
        )}
      </div>
    </div>
  );
}
