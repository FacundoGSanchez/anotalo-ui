import React from "react";
import { Row, Col, Card, Tag, Typography } from "antd";
import {
  MdAttachMoney,
  MdCreditCard,
  MdCreditScore,
  MdSyncAlt,
  MdOutlineContactPage,
  MdQrCode2,
} from "react-icons/md";

const { Title } = Typography;

const StepFormaPago = ({ tipo, onNext }) => {
  // Definición de opciones con sus respectivos estilos
  const opciones = [
    {
      key: "Efectivo",
      label: "Efectivo",
      icon: <MdAttachMoney />,
      color: "#52c41a",
    },
    {
      key: "Debito",
      label: "Débito",
      icon: <MdCreditCard />,
      color: "#1890ff",
    },
    {
      key: "Credito",
      label: "Crédito",
      icon: <MdCreditScore />,
      color: "#722ed1",
    },
    {
      key: "Transferencia",
      label: "Transferencia",
      icon: <MdSyncAlt />,
      color: "#fa8c16",
    },
    {
      key: "Cta Corriente",
      label: "Cta. Corriente",
      icon: <MdOutlineContactPage />,
      color: "#eb2f96",
    },
    { key: "QR", label: "QR", icon: <MdQrCode2 />, color: "#13c2c2" },
  ];

  const colorMap = {
    Venta: "#1890ff",
    Pago: "#fa8c16",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER DE CONTEXTO */}
      <div style={{ marginBottom: "8px" }}>
        <Tag
          color={colorMap[tipo]}
          style={{ borderRadius: "4px", fontWeight: "700", fontSize: "11px" }}
        >
          {tipo === "Venta" ? "VENTA / COBRO" : "PAGO / EGRESO"}
        </Tag>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Title
          level={4}
          style={{ margin: 0, fontSize: "18px", color: "#434343" }}
        >
          ¿Cómo paga el {tipo === "Venta" ? "cliente" : "proveedor"}?
        </Title>
      </div>

      {/* GRILLA DE SELECCIÓN TÁCTIL */}
      <div style={{ flex: 1 }}>
        <Row gutter={[8, 8]}>
          {opciones.map((opt) => (
            <Col span={12} key={opt.key}>
              <Card
                hoverable
                onClick={() => onNext(opt.key)}
                styles={{ body: { padding: "20px 8px" } }} // Padding vertical generoso para el dedo
                style={{
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid #e8e8e8",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    fontSize: "38px",
                    color: opt.color,
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  {opt.icon}
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "#262626",
                    letterSpacing: "0.5px",
                  }}
                >
                  {opt.label.toUpperCase()}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default StepFormaPago;
