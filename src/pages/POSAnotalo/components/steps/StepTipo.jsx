import React from "react";
import { Typography, Card } from "antd";
import { OPCIONES_TIPO, POS_COLORS } from "../../../../constants/posConstants";

const { Text } = Typography;

const StepTipo = ({ onNext }) => {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {OPCIONES_TIPO.map((opt) => (
          <TipoCard key={opt.key} opt={opt} onNext={onNext} fullWidth />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Text
          type="secondary"
          style={{
            fontSize: "11px",
            letterSpacing: "0.5px",
            fontWeight: "700",
          }}
        >
          PASO 1 DE 4 | SELECCIONAR TIPO
        </Text>
      </div>
    </div>
  );
};

// Sub-componente para evitar repetición de estilos
const TipoCard = ({ opt, onNext, fullWidth }) => {
  const colorTransaccion = POS_COLORS[opt.key] || POS_COLORS.DEFAULT;

  return (
    <Card
      hoverable
      bordered={false}
      onClick={() => onNext(opt.key)}
      styles={{ body: { padding: "16px" } }}
      style={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = colorTransaccion)
      }
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f0f0f0")}
    >
      <div
        style={{
          display: "flex",
          alignItems: fullWidth ? "center" : "center",
          justifyContent: "space-between",
          flexDirection: fullWidth ? "row" : "column",
          textAlign: "center",
          gap: fullWidth ? "12px" : "10px",
        }}
      >
        {/* CONTENEDOR DE TEXTOS (Invertido: Texto ahora va a la izquierda en fullWidth) */}
        <div
          style={{
            textAlign: fullWidth ? "left" : "center",
            order: fullWidth ? 1 : 2,
          }}
        >
          <Text
            strong
            style={{
              fontSize: fullWidth ? "16px" : "13px",
              display: "block",
              color: fullWidth ? "#262626" : "#8c8c8c", // Más suave para Ingreso/Egreso
              textTransform: !fullWidth ? "uppercase" : "none",
              letterSpacing: !fullWidth ? "0.5px" : "normal",
            }}
          >
            {opt.label}
          </Text>
          {fullWidth && (
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {opt.desc}
            </Text>
          )}
        </div>

        {/* ICONO (Invertido: Icono va a la derecha en fullWidth / Arriba en Column) */}
        <div
          style={{
            fontSize: fullWidth ? "24px" : "22px",
            color: colorTransaccion,
            backgroundColor: `${colorTransaccion}15`,
            width: fullWidth ? "48px" : "44px",
            height: fullWidth ? "48px" : "44px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            order: fullWidth ? 2 : 1,
          }}
        >
          {opt.icon}
        </div>
      </div>
    </Card>
  );
};

export default StepTipo;
