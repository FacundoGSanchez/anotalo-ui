import { Card, Typography } from "antd";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";

const { Text } = Typography;

const TIPOS_ORDEN = [
  { key: MOVIMIENTO_TIPOS.VENTA, label: "Ventas" },
  { key: MOVIMIENTO_TIPOS.PAGO, label: "Pagos" },
  { key: MOVIMIENTO_TIPOS.INGRESO, label: "Ingresos" },
  { key: MOVIMIENTO_TIPOS.RETIRO, label: "Retiros" },
];

const ResumenCards = ({ totales }) => {
  const cards = TIPOS_ORDEN
    .map((t) => ({ ...t, amount: totales[t.key] || 0, color: POS_COLORS[t.key] }));

  return (
    <div className="custom-scrollbar-container">
      <style>{`
        .resumen-grid {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }
        .resumen-grid > .ant-card {
          flex: 1;
          min-width: 0;
        }
      `}</style>

      <div className="resumen-grid">
        {cards.map((c) => (
          <Card
            key={c.key}
            size="small"
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
            styles={{
              body: {
                padding: "8px 10px",
                borderLeft: `4px solid ${c.color}`,
                borderRadius: "12px",
              },
            }}
          >
            <Text
              type="secondary"
              style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.3px", display: "block", whiteSpace: "nowrap" }}
            >
              {c.label.toUpperCase()}
            </Text>

            <div style={{ display: "flex", alignItems: "baseline", marginTop: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#8c8c8c", marginRight: "1px" }}>
                $
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.2", color: "#262626", letterSpacing: "-0.5px" }}>
                {c.amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumenCards;
