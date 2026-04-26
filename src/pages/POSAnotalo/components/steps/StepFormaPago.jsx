import React from "react";
import { Card, Typography, Space } from "antd";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
  FORMAS_PAGO,
} from "../../../../constants/posConstants";

const { Title, Text } = Typography;

const StepFormaPago = ({ tipo, onNext }) => {
  // 1. Acceso seguro al color del tema (usando 'tipo' directamente)
  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  // 2. Filtrado de opciones según el tipo de movimiento
  // Quitamos Cta Corriente para los Pagos (egresos a proveedores)
  const opcionesFiltradas = FORMAS_PAGO.filter((opt) => {
    if (tipo === MOVIMIENTO_TIPOS.PAGO && opt.key === "Cta Corriente")
      return false;
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* LISTADO DE SELECCIÓN TÁCTIL */}
      <div style={{ flex: 1 }}>
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          {opcionesFiltradas.map((opt) => (
            <Card
              key={opt.key}
              hoverable
              onClick={() => onNext(opt.key)}
              styles={{ body: { padding: "12px 20px" } }}
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                background: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = opt.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color: "#262626",
                    letterSpacing: "0.3px",
                  }}
                >
                  {opt.label.toUpperCase()}
                </Text>

                {/* ICONO CIRCULAR A LA DERECHA */}
                <div
                  style={{
                    fontSize: "24px",
                    color: opt.color,
                    backgroundColor: `${opt.color}15`,
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {opt.icon}
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Text
          type="secondary"
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          PASO 3 DE 4 | SELECCIONAR FORMA DE PAGO
        </Text>
      </div>
    </div>
  );
};

export default StepFormaPago;
