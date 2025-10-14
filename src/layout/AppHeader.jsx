import { Layout, Button, theme, Avatar, Popover, Card } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

const { Header } = Layout;

const mockUser = {
  name: "Jane Doe",
  role: "Administradora",
  email: "jane.doe@organizacion.com",
  avatarUrl: "https://placehold.co/150x150/007bff/ffffff?text=JD",
};

const userCardContent = (
  <Card
    style={{ width: 250, border: "none" }}
    // Advertencia corregida: styles.body reemplaza a bodyStyle
    styles={{ body: { padding: 10 } }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Avatar size={64} src={mockUser.avatarUrl} icon={<UserOutlined />} />
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: 0, fontWeight: "bold" }}>{mockUser.name}</h4>
        <p style={{ margin: 0, color: "#999", fontSize: "0.85rem" }}>
          {mockUser.role}
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>
          {mockUser.email}
        </p>
      </div>
      <Button type="primary" danger style={{ marginTop: 10 }}>
        Cerrar Sesión
      </Button>
    </div>
  </Card>
);

const AppHeader = ({ collapsed, handleToggle }) => {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  const headerBackgroundColor = "#f5f5f5";

  return (
    <Header
      style={{
        padding: "0 16px",
        background: headerBackgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${colorBorderSecondary}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* SECCIÓN IZQUIERDA: Botón de menú */}
      <div style={{ display: "flex", alignItems: "center", width: "20%" }}>
        <Button
          onClick={handleToggle}
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ fontSize: "16px", width: 64, height: 64 }}
        />
      </div>

      {/* SECCIÓN DERECHA: Avatar del Usuario con Popover */}
      <div
        style={{ width: "20%", display: "flex", justifyContent: "flex-end" }}
      >
        <Popover
          content={userCardContent}
          title={null}
          trigger="hover"
          placement="bottomRight"
        >
          <Avatar
            size="large"
            src={mockUser.avatarUrl}
            icon={<UserOutlined />}
            style={{ cursor: "pointer", backgroundColor: "#87d068" }}
          />
        </Popover>
      </div>
    </Header>
  );
};

export default AppHeader;
