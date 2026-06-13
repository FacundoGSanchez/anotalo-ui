import React, { useState } from "react";
import { Card, Typography, Button, Divider, Tag, message } from "antd";
import { MdSave, MdPerson, MdWallet, MdInfoOutline, MdExpandMore } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
} from "../../../../constants/posConstants";
import { movimientoService } from "../../../../services/movimientoService";
import { useArgentineDate } from "../../../../hooks/useArgentineDate";

const { Title, Text } = Typography;

const StepConfirmar = ({ movimiento, onConfirm }) => {
  const { user } = useAuth();
  const { getNowISO } = useArgentineDate();
  const activeColor = POS_COLORS[movimiento.tipo] || POS_COLORS.DEFAULT;
  const [expandido, setExpandido] = useState(false);
  const totalLineItems = movimiento.lineItems?.reduce((acc, item) => acc + Number(item.importe), 0) || 0;

  const handleGuardar = () => {
    // Preparamos el objeto final con la fecha argentina
    const movimientoFinal = {
      ...movimiento,
      fecha: getNowISO(),
    };
    const resultado = movimientoService.save(movimientoFinal, user);

    if (resultado.success) {
      message.success(`${movimiento.tipo} registrado correctamente`);
      if (onConfirm) onConfirm();
    } else {
      message.error("Error al procesar el registro");
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
      {/* TICKET */}
      <Card
        style={{
          borderRadius: "20px",
          border: `1px solid ${activeColor}30`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
        }}
        styles={{ body: { padding: "24px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Tag
            color={activeColor}
            style={{
              padding: "2px 14px",
              borderRadius: "8px",
              fontWeight: "700",
            }}
          >
            {movimiento.tipo}
          </Tag>
          <Title
            level={1}
            style={{ margin: "12px 0 0 0", fontSize: "44px", color: "#262626" }}
          >
            $ {Number(movimiento.importe).toLocaleString("es-AR")}
          </Title>
        </div>

        {/* LINE ITEMS — collapsible */}
        {movimiento.lineItems?.length > 0 && (
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandido((prev) => !prev)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                DETALLE ({movimiento.lineItems.length} items)
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Text strong style={{ fontSize: "13px" }}>
                  $ {totalLineItems.toLocaleString("es-AR")}
                </Text>
                <MdExpandMore
                  size={20}
                  style={{
                    color: "#8c8c8c",
                    transition: "transform 0.2s",
                    transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </div>
            {expandido && (
              <div style={{ padding: "0 16px 12px" }}>
                {movimiento.lineItems.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom:
                        idx < movimiento.lineItems.length - 1
                          ? "1px solid #e8e8e8"
                          : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      {item.rubro && (
                        <div style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: `${activeColor}15`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1, color: activeColor }}>{item.rubro.sigla}</span>
                        </div>
                      )}
                      <Text style={{ fontSize: "13px", color: "#595959" }}>
                        {item.rubro?.nombre || `Item ${idx + 1}`}
                      </Text>
                    </div>
                    <Text strong style={{ fontSize: "13px" }}>
                      $ {Number(item.importe).toLocaleString("es-AR")}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider style={{ margin: "16px 0" }} />

        {/* INFO GRID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InfoRow
            icon={<MdWallet size={20} color={activeColor} />}
            label="MEDIO DE PAGO"
            value={movimiento.formaPago || "Efectivo"}
            color={activeColor}
          />
          <InfoRow
            icon={<MdPerson size={20} color={activeColor} />}
            label={
              movimiento.tipo === MOVIMIENTO_TIPOS.VENTA || movimiento.tipo === MOVIMIENTO_TIPOS.COBRO ? "CLIENTE" : "ENTIDAD"
            }
            value={movimiento.entidad?.nombre || "Caja Interna"}
            color={activeColor}
          />
        </div>
      </Card>

      <Button
        type="primary"
        block
        size="large"
        onClick={handleGuardar}
        style={{
          marginTop: "24px",
          height: "64px",
          borderRadius: "16px",
          fontSize: "19px",
          fontWeight: "bold",
          background: activeColor,
          borderColor: activeColor,
        }}
      >
        <MdSave size={24} style={{ marginRight: 10 }} />
        REGISTRAR {movimiento.tipo?.toUpperCase()}
      </Button>

      {/* LEYENDA DESDE SERVICIO */}
      <div
        style={{
          textAlign: "center",
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <MdInfoOutline size={18} style={{ color: activeColor }} />
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {movimientoService.getLeyendaInformativa(
            movimiento,
            MOVIMIENTO_TIPOS,
          )}
        </Text>
      </div>
    </div>
  );
};

// Sub-componente interno para limpiar el JSX principal
const InfoRow = ({ icon, label, value, color }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: `${color}10`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "12px",
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <Text type="secondary" style={{ display: "block", fontSize: "11px" }}>
        {label}
      </Text>
      <Text strong style={{ fontSize: "15px" }}>
        {value}
      </Text>
    </div>
  </div>
);

export default StepConfirmar;
