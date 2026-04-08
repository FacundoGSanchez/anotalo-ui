import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { MdPeople, MdStore, MdManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import GestionItem from "./GestionItem";

const { Text } = Typography;

const GestionGrid = () => {
  const navigate = useNavigate();

  const handleNavigate = (tipo) => {
    navigate(`/entidades/${tipo}`);
  };

  return (
    <Card
      title={
        <Text strong style={{ fontSize: "16px" }}>
          Gestión
        </Text>
      }
      style={{
        borderRadius: "16px",
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "16px",
      }}
    >
      <Row gutter={[0, 8]}>
        <Col span={8}>
          <GestionItem
            icon={<MdPeople />}
            label="Clientes"
            onClick={() => handleNavigate("clientes")}
          />
        </Col>
        <Col span={8}>
          <GestionItem
            icon={<MdStore />}
            label="Proveedores"
            onClick={() => handleNavigate("proveedores")}
          />
        </Col>
        <Col span={8}>
          <GestionItem
            icon={<MdManageAccounts />}
            label="Usuarios"
            onClick={() => navigate("/usuarios")}
            disabled={true}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default GestionGrid;
