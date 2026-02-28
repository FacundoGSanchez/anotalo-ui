import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { MdPeople, MdStore, MdManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Hook de navegación

const { Text } = Typography;

const GestionItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      padding: "12px 0", // Un poco más de aire para el touch
      transition: "transform 0.1s ease",
    }}
    // Efecto simple de feedback al presionar
    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <div
      style={{
        fontSize: "28px",
        color: "#595959",
        marginBottom: "6px",
        background: "#f5f5f5",
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <Text style={{ fontSize: "12px", color: "#595959", fontWeight: "500" }}>
      {label}
    </Text>
  </div>
);

const GestionGrid = () => {
  const navigate = useNavigate();

  const handleNavigate = (tipo) => {
    if (tipo === "usuarios") {
      // Si aún no tienes la página de usuarios, puedes mostrar un mensaje
      // o navegar a una ruta que crearás luego
      navigate("/usuarios");
    } else {
      // Navega a /entidades/clientes o /entidades/proveedores
      navigate(`/entidades/${tipo}`);
    }
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
            onClick={() => handleNavigate("usuarios")}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default GestionGrid;
