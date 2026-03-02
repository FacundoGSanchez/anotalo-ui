import React from "react";
import { Card, Typography, Button, Divider, Tag, message } from "antd";
import { MdSave, MdPerson, MdWallet, MdInfoOutline } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
} from "../../../../constants/posConstants";

const { Title, Text } = Typography;

const StepConfirmar = ({ movimiento, onConfirm }) => {
  const { user } = useAuth();
  const activeColor = POS_COLORS[movimiento.tipo] || POS_COLORS.DEFAULT;

  // --- LÓGICA DE LEYENDA DINÁMICA ---
  const obtenerLeyendaInformativa = () => {
    const esEfectivo = movimiento.formaPago === "Efectivo";
    const esSalida =
      movimiento.tipo === MOVIMIENTO_TIPOS.PAGO ||
      movimiento.tipo === MOVIMIENTO_TIPOS.RETIRO;

    if (esEfectivo) {
      return esSalida
        ? "Esta salida de efectivo se descontará de la caja física."
        : "Esta entrada de efectivo se sumará a la caja física.";
    }

    // Leyendas para medios digitales/bancarios
    switch (movimiento.formaPago) {
      case "Transferencia":
      case "QR":
        return `Se registrará como un movimiento en tu cuenta de ${movimiento.formaPago}.`;
      case "Debito":
      case "Credito":
        return "El importe impactará a través de la terminal de tarjetas.";
      case "Cta Corriente":
        return "Este monto se cargará al saldo de la cuenta del cliente/proveedor.";
      default:
        return "Se registrará el movimiento bajo la forma de pago seleccionada.";
    }
  };

  const ejecutarGuardado = () => {
    try {
      const historialPrevio =
        JSON.parse(localStorage.getItem("movimientos_db")) || [];

      const nuevoRegistro = {
        ...movimiento,
        id: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        usuario: user?.nombre || "Admin",
        formaPago: movimiento.formaPago || "Efectivo",
        entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna" },
      };

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem("movimientos_db", JSON.stringify(nuevoHistorial));

      message.success(`${movimiento.tipo} registrado correctamente`);
      onConfirm();
    } catch (error) {
      console.error("Error en guardado:", error);
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
      {/* HEADER RESUMEN */}
      <div
        style={{
          display: "flex",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "20px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ width: "8px", backgroundColor: activeColor }} />
        <div style={{ padding: "16px" }}>
          <Text
            type="secondary"
            style={{ fontSize: "11px", fontWeight: "700", display: "block" }}
          >
            FINALIZAR OPERACIÓN
          </Text>
          <Title
            level={4}
            style={{ margin: 0, fontSize: "18px", color: "#434343" }}
          >
            Resumen del {movimiento.tipo}
          </Title>
        </div>
      </div>

      {/* FICHA TICKET */}
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
              textTransform: "uppercase",
            }}
          >
            {movimiento.tipo}
          </Tag>
          <Title
            level={1}
            style={{ margin: "12px 0 0 0", fontSize: "44px", color: "#262626" }}
          >
            $ {movimiento.importe.toLocaleString("es-AR")}
          </Title>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: `${activeColor}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <MdWallet size={20} style={{ color: activeColor }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "11px" }}
              >
                MEDIO DE PAGO
              </Text>
              <Text strong style={{ fontSize: "15px" }}>
                {movimiento.formaPago || "Efectivo"}
              </Text>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: `${activeColor}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <MdPerson size={20} style={{ color: activeColor }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "11px" }}
              >
                {movimiento.tipo === MOVIMIENTO_TIPOS.VENTA
                  ? "CLIENTE"
                  : movimiento.tipo === MOVIMIENTO_TIPOS.PAGO
                    ? "PROVEEDOR"
                    : "DESTINO"}
              </Text>
              <Text strong style={{ fontSize: "15px" }}>
                {movimiento.entidad?.nombre || "Caja Interna"}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* BOTÓN FINAL */}
      <Button
        type="primary"
        block
        size="large"
        onClick={ejecutarGuardado}
        style={{
          marginTop: "24px",
          height: "64px",
          borderRadius: "16px",
          fontSize: "19px",
          fontWeight: "bold",
          background: activeColor,
          borderColor: activeColor,
          boxShadow: `0 8px 20px ${activeColor}40`,
        }}
      >
        <MdSave size={24} style={{ marginRight: 10 }} />
        REGISTRAR {movimiento.tipo.toUpperCase()}
      </Button>

      {/* LEYENDA DINÁMICA SEGÚN FORMA DE PAGO */}
      <div
        style={{
          textAlign: "center",
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0 10px",
        }}
      >
        <MdInfoOutline
          size={18}
          style={{ color: activeColor, flexShrink: 0 }}
        />
        <Text type="secondary" style={{ fontSize: "12px", lineHeight: "1.4" }}>
          {obtenerLeyendaInformativa()}
        </Text>
      </div>
    </div>
  );
};

export default StepConfirmar;
