import React from "react";
import { Card, Typography, Button, Space, Divider, Tag, message } from "antd";
import { MdSave, MdCheckCircleOutline } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

const { Title, Text } = Typography;

const StepConfirmar = ({ movimiento, onConfirm }) => {
  const { user } = useAuth();
  const colorTema = movimiento.tipo === "Venta" ? "#1890ff" : "#fa8c16";

  const ejecutarGuardado = () => {
    try {
      const historialPrevio =
        JSON.parse(localStorage.getItem("movimientos_db")) || [];

      const nuevoRegistro = {
        ...movimiento,
        id: Date.now(),
        fecha: new Date().toLocaleDateString("sv-SE"),
        hora: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        usuario: user?.nombre || "Admin",
      };

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem("movimientos_db", JSON.stringify(nuevoHistorial));

      onConfirm();
    } catch (error) {
      message.error("Error al guardar");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <MdCheckCircleOutline size={45} color="#52c41a" />
        <Title level={3} style={{ margin: 0 }}>
          Revisar Datos
        </Title>
      </div> */}

      <Card
        style={{ borderRadius: "16px", border: "1px solid #d9d9d9" }}
        styles={{ body: { padding: "20px" } }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* TIPO DE OPERACIÓN DESTACADO */}
          <div style={{ textAlign: "center" }}>
            <Tag
              color={colorTema}
              style={{
                padding: "4px 16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "800",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              {movimiento.tipo}
            </Tag>
            <Title
              level={1}
              style={{ margin: 0, fontSize: "36px", lineHeight: 1 }}
            >
              ${" "}
              {movimiento.importe.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </Title>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              IMPORTE TOTAL
            </Text>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Forma de Pago</Text>
              <Text strong style={{ fontSize: "15px" }}>
                {movimiento.formaPago}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Entidad</Text>
              <Text strong style={{ fontSize: "15px" }}>
                {movimiento.entidad?.nombre || "General"}
              </Text>
            </div>
          </div>
        </Space>
      </Card>

      {/* MARGEN SUPERIOR AÑADIDO (marginTop: '24px') */}
      <Button
        type="primary"
        block
        size="large"
        onClick={ejecutarGuardado}
        style={{
          marginTop: "24px",
          height: "60px",
          borderRadius: "14px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "#52c41a",
          borderColor: "#52c41a",
          boxShadow: "0 4px 10px rgba(82, 196, 26, 0.2)",
        }}
      >
        <MdSave size={24} style={{ marginRight: 8 }} /> FINALIZAR
      </Button>
    </div>
  );
};

export default StepConfirmar;
