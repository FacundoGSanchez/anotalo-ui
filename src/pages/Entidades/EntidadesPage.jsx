import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card } from "antd";
import { MdPerson, MdGroups } from "react-icons/md";
import EntidadesListado from "./components/EntidadesListado";
import EntidadDetalleContainer from "./components/EntidadDetalle/EntidadDetalleContainer";

const { Text } = Typography;

const TIPOS = [
  { key: "clientes", label: "Clientes", icon: <MdPerson size={28} />, color: "#1890ff" },
  { key: "proveedores", label: "Proveedores", icon: <MdGroups size={28} />, color: "#52c41a" },
];

const SelectorEntidad = () => {
  const [seleccion, setSeleccion] = useState(null);
  const navigate = useNavigate();

  if (seleccion) {
    return <EntidadesListado tipo={seleccion} onBack={() => setSeleccion(null)} />;
  }

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <Text strong style={{ fontSize: "18px", display: "block", marginBottom: "4px", color: "#262626" }}>
        Nóminas
      </Text>
      <Text type="secondary" style={{ fontSize: "13px", display: "block", marginBottom: "20px" }}>
        Seleccioná la entidad que querés administrar
      </Text>

      <div style={{ display: "flex", gap: 12 }}>
        {TIPOS.map((t) => (
          <Card
            key={t.key}
            hoverable
            onClick={() => setSeleccion(t.key)}
            style={{
              flex: 1,
              borderRadius: "18px",
              border: `1px solid ${t.color}20`,
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
            styles={{ body: { padding: "24px 16px", textAlign: "center" } }}
          >
            <div style={{ color: t.color, marginBottom: 8 }}>{t.icon}</div>
            <Text strong style={{ fontSize: "15px", color: t.color }}>
              {t.label}
            </Text>
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
