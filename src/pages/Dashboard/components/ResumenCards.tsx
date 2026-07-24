import { Card, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "@/constants/posConstants";
import type { MovimientoTipoKey } from "@/constants/posConstants";

const { Text } = Typography;

interface TipoOrden {
  key: MovimientoTipoKey;
  label: string;
}

const TIPOS_ORDEN: TipoOrden[] = [
  { key: MOVIMIENTO_TIPOS.VENTA, label: "Ventas" },
  { key: MOVIMIENTO_TIPOS.PAGO, label: "Pagos" },
  { key: MOVIMIENTO_TIPOS.COBRO, label: "Cobros" },
  { key: MOVIMIENTO_TIPOS.INGRESO, label: "Ingresos" },
  { key: MOVIMIENTO_TIPOS.RETIRO, label: "Retiros" },
];

interface Totales {
  [key: string]: number;
}

interface ResumenCardsProps {
  totales: Totales;
}

interface CardData extends TipoOrden {
  amount: number;
  color: string;
}

const ResumenCards = ({ totales }: ResumenCardsProps) => {
  const cards: CardData[] = TIPOS_ORDEN
    .map((t) => ({ ...t, amount: totales[t.key] || 0, color: POS_COLORS[t.key] }))
    .filter((c) => c.amount > 0);

  return (
    <div>
      <Text
        strong
        style={{
          display: "block",
          fontSize: "15px",
          color: "#262626",
          marginBottom: "2px",
        }}
      >
        Resumen de Hoy
      </Text>
      <Text
        type="secondary"
        style={{ display: "block", fontSize: "12px", textTransform: "capitalize", marginBottom: "14px" }}
      >
        {dayjs().locale("es").format("dddd, DD [de] MMMM")}
      </Text>

      <style>{`
        .resumen-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
      `}</style>

      <div className="resumen-grid">
        {cards.map((c) => (
          <Card
            key={c.key}
            size="small"
            style={{
              borderRadius: "14px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            styles={{
              body: {
                padding: "14px 16px",
                borderLeft: `5px solid ${c.color}`,
                borderRadius: "14px",
              },
            }}
          >
            <Text
              type="secondary"
              style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", display: "block", whiteSpace: "nowrap" }}
            >
              {c.label.toUpperCase()}
            </Text>

            <div style={{ display: "flex", alignItems: "baseline", marginTop: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#8c8c8c", marginRight: "2px" }}>
                $
              </span>
              <span style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.1", color: "#262626", letterSpacing: "-0.5px" }}>
                {c.amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <Text type="secondary" style={{ fontSize: "13px", display: "block", textAlign: "center", padding: "10px 0" }}>
          Sin movimientos hoy
        </Text>
      )}
    </div>
  );
};

export default ResumenCards;
