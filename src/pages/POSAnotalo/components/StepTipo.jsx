import React from "react";
import { Typography, Card, Space } from "antd";
import {
  MdOutlineAddShoppingCart,
  MdOutlineLocalShipping,
  MdOutlineAccountBalanceWallet,
  MdChevronRight,
} from "react-icons/md";

const { Title, Text } = Typography;

const StepTipo = ({ onNext }) => {
  const opciones = [
    {
      key: "Venta",
      label: "Venta (Cliente)",
      icon: <MdOutlineAddShoppingCart />,
      color: "#1890ff",
      desc: "Ingreso por ventas",
    },
    {
      key: "Pago",
      label: "Pago (Proveedor)",
      icon: <MdOutlineLocalShipping />,
      color: "#fa8c16",
      desc: "Egreso a proveedores",
    },
    {
      key: "Retiro",
      label: "Retiro (Caja)",
      icon: <MdOutlineAccountBalanceWallet />,
      color: "#546e7a",
      desc: "Salida interna de efectivo",
    },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={4}>Seleccioná el tipo</Title>
      </div>

      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {opciones.map((opt) => (
          <Card
            key={opt.key}
            hoverable
            onClick={() => onNext(opt.key)}
            styles={{ body: { padding: "16px" } }}
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
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
                <div
                  style={{
                    fontSize: "24px",
                    color: opt.color,
                    backgroundColor: `${opt.color}15`,
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {opt.icon}
                </div>
                <div>
                  <Text strong style={{ fontSize: "16px", display: "block" }}>
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
        ))}
      </Space>
    </div>
  );
};

export default StepTipo;
