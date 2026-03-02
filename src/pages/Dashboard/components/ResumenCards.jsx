import React from "react";
import { Card, Typography, Space } from "antd";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";

const { Text } = Typography;

const ResumenCard = ({ title, amount, color }) => (
  <Card
    style={{
      minWidth: "165px", // Ajustado para dejar ver el comienzo de la siguiente card
      borderRadius: "16px",
      border: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      flexShrink: 0,
    }}
    styles={{
      body: {
        padding: "16px",
        borderLeft: `6px solid ${color}`,
        borderRadius: "16px",
      },
    }}
  >
    <Space direction="vertical" size={2}>
      <Text
        type="secondary"
        style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}
      >
        {title.toUpperCase()}
      </Text>

      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#8c8c8c",
            marginRight: "4px",
          }}
        >
          $
        </span>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "1.2",
            color: "#262626",
            letterSpacing: "-0.5px",
          }}
        >
          {amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
        </span>
      </div>
    </Space>
  </Card>
);

const ResumenCards = ({ totales }) => {
  return (
    <div className="custom-scrollbar-container">
      {/* Estilos para el scroll suave y fino */}
      <style>
        {`
          .custom-scroll-wrapper {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding: 4px 4px 12px 4px;
            /* Suavizado para móviles */
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .custom-scroll-wrapper::-webkit-scrollbar {
            height: 4px; /* Scroll muy fino */
          }

          .custom-scroll-wrapper::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scroll-wrapper::-webkit-scrollbar-thumb {
            background: #e8e8e8; /* Color gris muy claro */
            border-radius: 10px;
          }

          .custom-scroll-wrapper::-webkit-scrollbar-thumb:hover {
            background: #d9d9d9;
          }

          /* Asegura que las cards se alineen al scrollear */
          .custom-scroll-wrapper > div {
            scroll-snap-align: start;
          }
        `}
      </style>

      <div className="custom-scroll-wrapper">
        <ResumenCard
          title="Ventas"
          amount={totales.ventas}
          color={POS_COLORS[MOVIMIENTO_TIPOS.VENTA]}
        />
        <ResumenCard
          title="Pagos"
          amount={totales.pagos}
          color={POS_COLORS[MOVIMIENTO_TIPOS.PAGO]}
        />
        <ResumenCard
          title="Ingresos"
          amount={totales.ingresos || 0}
          color={POS_COLORS[MOVIMIENTO_TIPOS.INGRESO]}
        />
        <ResumenCard
          title="Retiros"
          amount={totales.retiros}
          color={POS_COLORS[MOVIMIENTO_TIPOS.RETIRO]}
        />
      </div>
    </div>
  );
};

export default ResumenCards;
