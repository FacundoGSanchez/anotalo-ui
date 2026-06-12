import React from "react";
import { Typography } from "antd";
import { MdShoppingCart } from "react-icons/md";

const { Title, Text } = Typography;

const AdminComprasPage = () => {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", color: "#fa8c16", marginBottom: "16px" }}>
        <MdShoppingCart />
      </div>
      <Title level={4} style={{ color: "#262626" }}>Compras</Title>
      <Text type="secondary">Módulo de compras próximamente</Text>
    </div>
  );
};

export default AdminComprasPage;
