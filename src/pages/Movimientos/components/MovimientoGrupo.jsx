import React from "react";
import { Card, Typography, Tag } from "antd";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";

const { Text } = Typography;

const MovimientoGrupo = ({
  fecha,
  items,
  subtotal,
  showSubtotal,
  onSelect,
}) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          padding: "0 4px",
        }}
      >
        <Text
          type="secondary"
          style={{
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {fecha}
        </Text>
        {showSubtotal && (
          <Text style={{ color: "#8c8c8c", fontSize: "13px", fontWeight: 600 }}>
            Subtotal $ {subtotal.toLocaleString("es-AR")}
          </Text>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        {items.map((mov, i) => {
          const esEntrada =
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
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "2px",
                    }}
                  >
                    <Tag
                      color={POS_COLORS[mov.tipo]}
                      style={{
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: "none",
                        margin: 0,
                        lineHeight: "18px",
                        padding: "0 6px",
                      }}
                    >
                      {mov.tipo.charAt(0).toUpperCase()}
                    </Tag>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#595959",
                        fontWeight: 600,
                      }}
                    >
                      {mov.entidad?.nombre || "Caja Interna"}
                    </Text>
                  </div>
                  <Text
                    type="secondary"
                    style={{ fontSize: "11px", marginLeft: "32px" }}
                  >
                    {mov.formaPago} · {mov.hora || mov.fecha} hs
                  </Text>
                </div>

                <Text
                  strong
                  style={{
                    fontSize: "15px",
                    color: esEntrada ? "#52c41a" : "#ff4d4f",
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                >
                  ${mov.importe.toLocaleString("es-AR")}
                </Text>
              </div>
              {i < items.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "#f0f0f0",
                    margin: "0 12px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovimientoGrupo;
