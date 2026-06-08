import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, Tabs } from "antd";
import { MdPerson, MdGroups } from "react-icons/md";
import EntidadesListado from "./components/EntidadesListado";
import EntidadDetalleContainer from "./components/EntidadDetalle/EntidadDetalleContainer";

const { Text } = Typography;

const TIPOS = [
  { key: "clientes", label: "Clientes", icon: <MdPerson size={24} />, color: "#1890ff" },
  { key: "proveedores", label: "Proveedores", icon: <MdGroups size={24} />, color: "#52c41a" },
];

const SelectorEntidad = () => {
  const [tab, setTab] = useState(TIPOS[0].key);
  const navigate = useNavigate();

  const tabItems = TIPOS.map((t) => ({
    key: t.key,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 0",
        }}
      >
        <span style={{ color: t.color, fontSize: "18px" }}>{t.icon}</span>
        <Text strong style={{ color: t.color }}>
          {t.label}
        </Text>
      </div>
    ),
    children: <EntidadesListado tipo={t.key} simple />,
  }));

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <Text strong style={{ fontSize: "18px", display: "block", marginBottom: "12px", color: "#262626" }}>
        Nóminas
      </Text>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={tabItems}
        style={{ marginBottom: "0" }}
      />
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
