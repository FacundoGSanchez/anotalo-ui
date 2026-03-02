import React from "react";
import { Typography, Card, Space } from "antd";
import { MdChevronRight } from "react-icons/md";
import { OPCIONES_TIPO, POS_COLORS } from "../../../../constants/posConstants";

const { Title, Text } = Typography;

const StepTipo = ({ onNext }) => {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* HEADER DEL PASO */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={4} style={{ margin: 0 }}>
          Seleccioná el tipo
        </Title>
        <Text type="secondary">¿Qué movimiento vas a registrar hoy?</Text>
      </div>

      {/* LISTADO DE OPCIONES MAPEADO DESDE UTILS */}
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {OPCIONES_TIPO.map((opt) => {
          // Obtenemos el color dinámicamente según la key
          const colorTransaccion = POS_COLORS[opt.key] || POS_COLORS.DEFAULT;

          return (
            <Card
              key={opt.key}
              hoverable
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
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#f0f0f0")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  {/* ICONO CON COLOR DINÁMICO DESDE POS_COLORS */}
                  <div
                    style={{
                      fontSize: "24px",
                      color: colorTransaccion,
                      backgroundColor: `${colorTransaccion}15`,
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {opt.icon}
                  </div>

                  <div>
                    <Text
                      strong
                      style={{
                        fontSize: "16px",
                        display: "block",
                        color: "#262626",
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      {opt.desc}
                    </Text>
                  </div>
                </div>

                <MdChevronRight size={24} style={{ color: "#d9d9d9" }} />
              </div>
            </Card>
          );
        })}
      </Space>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Text
          type="secondary"
          style={{ fontSize: "11px", letterSpacing: "0.5px" }}
        >
          PASO 1 DE 4
        </Text>
      </div>
    </div>
  );
};

export default StepTipo;
