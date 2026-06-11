import React from "react";
import { Typography } from "antd";
import { MdAssignment } from "react-icons/md";

const { Title, Text } = Typography;

const PedidosPage = () => {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", color: "#fa8c16", marginBottom: "16px" }}>
        <MdAssignment />
      </div>
      <Title level={4} style={{ color: "#262626" }}>Pedidos</Title>
      <Text type="secondary">
        Gestión de pedidos a proveedores, valores y pendientes de pago — próximamente
      </Text>
    </div>
  );
};

export default PedidosPage;
