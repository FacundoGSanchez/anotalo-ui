import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card } from "antd";
import { MdPerson, MdGroups } from "react-icons/md";
import EntidadesListado from "./components/EntidadesListado";
import EntidadDetalleContainer from "./components/EntidadDetalle/EntidadDetalleContainer";

const { Text, Title } = Typography;

const TIPOS = [
  { key: "clientes", label: "Clientes", icon: <MdPerson size={32} />, color: "#1890ff", desc: "Administrá los clientes y sus cuentas corrientes" },
  { key: "proveedores", label: "Proveedores", icon: <MdGroups size={32} />, color: "#52c41a", desc: "Gestioná tus proveedores y pagos" },
];

const SelectorEntidad = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
      <Title level={4} style={{ marginBottom: "20px", textAlign: "center", color: "#262626" }}>
        Nóminas
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {TIPOS.map((t) => (
          <Card
            key={t.key}
            hoverable
            variant="borderless"
            onClick={() => navigate(`/entidades/${t.key}`)}
            style={{
              borderRadius: "16px",
              border: `1px solid ${t.color}30`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                fontSize: "28px", color: t.color,
                background: `${t.color}15`, width: "60px", height: "60px",
                borderRadius: "16px", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                {t.icon}
              </div>
              <div>
                <Text strong style={{ fontSize: "18px", color: "#262626", display: "block" }}>
                  {t.label}
                </Text>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  {t.desc}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EntidadesPage = () => {
  const { tipo, action, id } = useParams();

  if (!tipo) {
    return <SelectorEntidad />;
  }

  if (action === "nuevo" || action === "edit") {
    return <EntidadDetalleContainer />;
  }
  return <EntidadesListado />;
};

export default EntidadesPage;
