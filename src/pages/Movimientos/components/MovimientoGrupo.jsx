import React from "react";
import { Card, Typography, Space, Divider, Tag } from "antd";
import dayjs from "dayjs";
import { MdChevronRight, MdEdit } from "react-icons/md";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";

const { Text, Title } = Typography;

const MovimientoGrupo = ({
  fecha,
  items,
  subtotal,
  showSubtotal,
  onSelect,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          padding: "8px 12px",
          backgroundColor: "#f0f2f5",
          borderRadius: "8px",
        }}
      >
        <Title
          level={5}
          style={{
            fontSize: "14px",
            color: "#595959",
            margin: 0,
            fontWeight: 600,
          }}
        >
          {fecha}
        </Title>
        {showSubtotal && (
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            Subtotal{" "}
            <span style={{ marginLeft: "12px", fontWeight: 700 }}>
              $ {subtotal.toLocaleString("es-AR")}
            </span>
          </Text>
        )}
      </div>

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
                        borderRadius: "6px",
                        fontSize: "14px",
                        border: "none",
                        fontWeight: 900,
                        marginRight: "8px",
                        width: "24px",
                        height: "24px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      {mov.tipo.charAt(0).toUpperCase()}
                    </Tag>
                    <Text strong style={{ fontSize: "14px", color: "#595959" }}>
                      {mov.entidad?.nombre || "Caja Interna"}
                    </Text>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    >
                      {mov.formaPago}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {dayjs(mov.fecha).format("HH:mm")} hs
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
                <Divider
                  style={{
                    margin: 0,
                    borderBlockStart: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                />
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default MovimientoGrupo;
