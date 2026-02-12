import { useAuth } from '../../hooks/useAuth';
import ProgramItem from './ProgramItem';

export default function ProgramList({
  programa, onAddItem, onEditItem, onRemoveItem, onMoveUp, onMoveDown,
  isLive, activeItemId, getItemElapsedSeconds, onCompleteItem, onUncompleteItem,
}) {
  const { isAdmin } = useAuth();

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, animation: "fadeSlideIn 0.5s ease 0.2s both",
      }}>
        <div style={{
          color: "#888", fontSize: 10, textTransform: "uppercase",
          letterSpacing: 1.5, fontWeight: 600,
        }}>&#128203; Orden del Programa</div>
        {isAdmin && !isLive && (
          <button onClick={onAddItem} style={{
            padding: "6px 14px", background: "linear-gradient(135deg, #E8B931, #d4a72a)",
            border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 12,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>+ Agregar</button>
        )}
      </div>

      {/* Items */}
      <div style={{ animation: "fadeSlideIn 0.5s ease 0.25s both" }}>
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
            textAlign: "center", padding: "40px 20px", color: "#555",
            fontSize: 14, fontStyle: "italic",
          }}>
            Este programa esta vacio. {isAdmin ? "Haz clic en '+ Agregar' para comenzar." : ""}
          </div>
        )}
      </div>
    </div>
  );
}
