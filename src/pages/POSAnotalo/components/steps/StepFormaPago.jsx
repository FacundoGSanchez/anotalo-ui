import React from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
  FORMAS_PAGO,
} from "../../../../constants/posConstants";

const { Title, Text } = Typography;

const StepFormaPago = ({ tipo, onNext }) => {
  // 1. Acceso seguro al color del tema (usando 'tipo' directamente)
  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  // 2. Determinar el sujeto de la pregunta dinámicamente
  const getSujeto = () => {
    switch (tipo) {
      case MOVIMIENTO_TIPOS.VENTA:
        return "el cliente";
      case MOVIMIENTO_TIPOS.PAGO:
        return "al proveedor";
      default:
        return "la operación";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* HEADER DE CONTEXTO CON BARRA LATERAL */}
      <div
        style={{
          display: "flex",
          background: "#f8f9fa",
          borderRadius: "12px",
          marginBottom: "20px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ width: "6px", backgroundColor: activeColor }} />
        <div style={{ padding: "12px 16px" }}>
          {/* <Text
            type="secondary"
            style={{
              fontSize: "11px",
              fontWeight: "700",
              display: "block",
              marginBottom: "4px",
              letterSpacing: "0.5px",
            }}
          >
            {tipo?.toUpperCase()}
          </Text> */}
          <Title
            level={4}
            style={{ margin: 0, fontSize: "17px", color: "#434343" }}
          >
            ¿Cómo paga {getSujeto()}?
          </Title>
        </div>
      </div>

      {/* GRILLA DE SELECCIÓN TÁCTIL */}
      <div style={{ flex: 1 }}>
        <Row gutter={[12, 12]}>
          {FORMAS_PAGO.map((opt) => (
            <Col span={12} key={opt.key}>
              <Card
                hoverable
                onClick={() => onNext(opt.key)}
                styles={{ body: { padding: "16px 8px" } }}
                style={{
                  borderRadius: "20px",
                  textAlign: "center",
                  border: "1px solid #f0f0f0",
                  background: "#ffffff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                }}
                // Efecto visual al pasar el mouse (para desktop)
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = opt.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* ICONO CIRCULAR */}
                <div
                  style={{
                    fontSize: "28px",
                    color: opt.color,
                    backgroundColor: `${opt.color}15`,
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px auto",
                  }}
                >
                  {opt.icon}
                </div>

                <Text
                  strong
                  style={{
                    fontSize: "13px",
                    color: "#262626",
                    display: "block",
                    letterSpacing: "0.3px",
                  }}
                >
                  {opt.label.toUpperCase()}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Text type="secondary" style={{ fontSize: "11px" }}>
          PASO 2 DE 4
        </Text>
      </div>
    </div>
  );
};

export default StepFormaPago;
