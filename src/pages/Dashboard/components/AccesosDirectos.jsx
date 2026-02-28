import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  MdOutlineAddShoppingCart,
  MdOutlineLocalShipping,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";

const { Text } = Typography;

const AccesoBtn = ({ icon, label, color, onClick }) => (
  <div
    onClick={onClick}
    className="acceso-btn-container" // Usaremos una clase para el efecto active
    style={{
      textAlign: "center",
      cursor: "pointer",
      padding: "8px 0",
      transition: "all 0.2s ease",
    }}
  >
    <div
      style={{
        fontSize: "28px",
        color: color,
        background: `${color}15`,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
      }}
    >
      {icon}
    </div>
    <Text strong style={{ fontSize: "13px", display: "block" }}>
      {label}
    </Text>
  </div>
);

const AccesosDirectos = ({ onSelectTipo }) => (
  <Card
    title={
      <Text strong style={{ fontSize: "16px" }}>
        Accesos Rápidos
      </Text>
    }
    style={{
      borderRadius: "16px",
      marginBottom: "16px",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <Row gutter={[8, 0]}>
      <Col span={8}>
        <AccesoBtn
          icon={<MdOutlineAddShoppingCart />}
          label="Venta"
          color="#1890ff"
          onClick={() => onSelectTipo("Venta")}
        />
      </Col>
      <Col span={8}>
        <AccesoBtn
          icon={<MdOutlineLocalShipping />}
          label="Pago"
          color="#fa8c16"
          onClick={() => onSelectTipo("Pago")}
        />
      </Col>
      <Col span={8}>
        <AccesoBtn
          icon={<MdOutlineAccountBalanceWallet />}
          label="Retiro"
          color="#546e7a"
          onClick={() => onSelectTipo("Retiro")}
        />
      </Col>
    </Row>
  </Card>
);

export default AccesosDirectos;
