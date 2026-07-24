import { Button, Typography } from "antd";
import { MdDeleteOutline, MdKeyboard } from "react-icons/md";
import { POS_COLORS } from "../../../../constants/posConstants";
import type { LineItem, MovimientoTipo } from "@/types";

const { Text } = Typography;

interface StepResumenItemProps {
  tipo: MovimientoTipo;
  lineItems: LineItem[];
  onNext: (data: { importe: number; lineItems: LineItem[] }) => void;
  onRemoveItem: (id: number) => void;
}

const StepResumenItem = ({ tipo, lineItems, onNext, onRemoveItem }: StepResumenItemProps) => {
  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;
  const fmt = (v: number): string => v.toLocaleString("es-AR");
  const total = lineItems.reduce((acc, item) => acc + item.importe, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease", height: "100%" }}>
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        paddingBottom: "8px",
      }}>
        {lineItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: "12px",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              {item.rubro && item.rubro.sigla ? (
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `${activeColor}15`,
                  color: activeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {item.rubro.sigla}
                </div>
              ) : (
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  color: "#8c8c8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  —
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <Text style={{ fontSize: "13px", color: "#262626", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.rubro?.nombre || "Sin rubro"}
                </Text>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                $ {fmt(item.importe)}
              </Text>
              <Button
                type="text"
                size="small"
                danger
                icon={<MdDeleteOutline size={16} />}
                onClick={() => onRemoveItem(item.id)}
                style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "#f8f9fa",
        borderRadius: "12px",
        marginTop: "8px",
      }}>
        <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>TOTAL</Text>
        <Text strong style={{ fontSize: "20px", color: activeColor }}>$ {fmt(total)}</Text>
      </div>

      <button
        onClick={() => onNext({ importe: total, lineItems })}
        style={{
          marginTop: "12px",
          height: "52px",
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: 700,
          border: "none",
          background: activeColor,
          color: "#fff",
          cursor: "pointer",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        onMouseDown={(e) => e.preventDefault()}
      >
        CONTINUAR
        <MdKeyboard size={16} style={{ transform: "rotate(-90deg)" }} />
      </button>
    </div>
  );
};

export default StepResumenItem;
