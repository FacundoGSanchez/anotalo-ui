import React from "react";
import { Typography, Card, Row, Col, Divider } from "antd";
import { MdChevronRight } from "react-icons/md";
import {
  OPCIONES_TIPO,
  POS_COLORS,
  MOVIMIENTO_TIPOS,
} from "../../../../constants/posConstants";

const { Title, Text } = Typography;

const StepTipo = ({ onNext }) => {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* OPCIONES PRINCIPALES (Venta y Pago) */}
        {OPCIONES_TIPO.filter(
          (o) =>
            o.key === MOVIMIENTO_TIPOS.VENTA || o.key === MOVIMIENTO_TIPOS.PAGO,
        ).map((opt) => (
          <TipoCard key={opt.key} opt={opt} onNext={onNext} fullWidth />
        ))}

        {/* SECCIÓN CAJA */}
        <div style={{ marginTop: "8px" }}>
          <Divider orientation="left" plain style={{ margin: "12px 0" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", fontWeight: "600", color: "#8c8c8c" }}
            >
              MOVIMIENTOS DE CAJA
            </Text>
          </Divider>
        </div>

        <Row gutter={[12, 12]}>
          {OPCIONES_TIPO.filter(
            (o) =>
              o.key === MOVIMIENTO_TIPOS.INGRESO ||
              o.key === MOVIMIENTO_TIPOS.RETIRO,
          ).map((opt) => (
            <Col span={12} key={opt.key}>
              <TipoCard opt={opt} onNext={onNext} />
            </Col>
          ))}
        </Row>
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
      styles={{ body: { padding: fullWidth ? "16px" : "12px" } }}
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
