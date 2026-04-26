import React from "react";
import { Card, Typography, Space, Divider, Tag } from "antd";
import { MdChevronRight } from "react-icons/md";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";

const { Text, Title } = Typography;

const MovimientoGrupo = ({ fecha, items, onSelect }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Title
        level={5}
        style={{
          fontSize: "16px",
          color: "#8c8c8c",
          marginBottom: "8px",
          marginLeft: "4px",
          fontWeight: 600,
        }}
      >
        {fecha}
      </Title>

      <Card
        styles={{ body: { padding: "0 16px" } }}
        style={{
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
        }}
      >
        {items.map((mov, index) => {
          // VARIABLE DEFINIDA COMO: isEntrada
          const isEntrada =
            mov.tipo === MOVIMIENTO_TIPOS.VENTA ||
            mov.tipo === MOVIMIENTO_TIPOS.INGRESO;

          return (
            <div key={mov.id}>
              <div
                onClick={() => onSelect(mov)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  cursor: "pointer",
                }}
              >
                {/* IZQUIERDA: Info apilada */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: "4px" }}>
                    <Tag
                      color={POS_COLORS[mov.tipo]}
                      style={{
                        borderRadius: "4px",
                        fontSize: "13px",
                        border: "none",
                        fontWeight: 800,
                        marginRight: "8px",
                      }}
                    >
                      {mov.tipo.toUpperCase()}
                    </Tag>
                    <Text strong style={{ fontSize: "15px", color: "#595959" }}>
                      {mov.entidad?.nombre || "Caja Interna"}
                    </Text>
                  </div>

                  <div style={{ display: "flex" }}>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "1.2",
                      }}
                    >
                      {mov.formaPago} | {mov.hora} hs
                    </Text>
                  </div>
                </div>

                {/* DERECHA: Importe e Icono */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right", minWidth: "125px" }}>
                    <Text
                      strong
                      style={{
                        color: isEntrada ? "#52c41a" : "#ff4d4f",
                        fontSize: "22px",
                        letterSpacing: "-0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${mov.importe.toLocaleString("es-AR")}
                    </Text>
                  </div>
                  <MdChevronRight size={18} color="#bfbfbf" />
                </div>
              </div>
              {index < items.length - 1 && (
                <Divider style={{ margin: 0, opacity: 0.4 }} />
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default MovimientoGrupo;
