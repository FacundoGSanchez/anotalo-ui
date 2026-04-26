import React from "react";
import { Card, Typography, Button, Divider, Tag, message } from "antd";
import { MdSave, MdPerson, MdWallet, MdInfoOutline } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
} from "../../../../constants/posConstants";
import { movimientoService } from "../../../../services/movimientoService"; // <--- Importamos servicio
import { useArgentineDate } from "../../../../hooks/useArgentineDate";

const { Title, Text } = Typography;

const StepConfirmar = ({ movimiento, onConfirm }) => {
  const { user } = useAuth();
  const { getNowISO } = useArgentineDate();
  const activeColor = POS_COLORS[movimiento.tipo] || POS_COLORS.DEFAULT;

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
              movimiento.tipo === MOVIMIENTO_TIPOS.VENTA ? "CLIENTE" : "ENTIDAD"
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

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Text
          type="secondary"
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          RESUMEN FINAL | CONFIRMAR REGISTRO
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
