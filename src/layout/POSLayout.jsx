import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import AnotaloLogo from "../pages/auth/Logo"; // Asume que el logo está aquí

const { Header, Content } = Layout;

const POSLayout = () => {
  const navigate = useNavigate();

  // Función para volver al inicio o al dashboard principal
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 1. Header (Navbar simple) */}
      <Header
        style={{
          padding: "0 24px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* Logo o Título del POS */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Reemplaza 'AnotaloLogo' o usa un texto simple */}
          <AnotaloLogo style={{ height: "30px", margin: 0 }} />
          <span
            style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "10px" }}
          >
            Punto de Venta
          </span>
        </div>

        {/* Opciones de la barra de navegación (solo Salir) */}
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[]}
          style={{ borderBottom: "none" }}
        >
          <Menu.Item key="1" onClick={handleGoHome}>
            Salir / Dashboard
          </Menu.Item>
        </Menu>
      </Header>

      {/* 2. Contenido del POS (donde se cargará RegistroArticulosPage) */}
      <Content>
        <Outlet />{" "}
        {/* Esto renderizará la página hija (RegistroArticulosPage) */}
      </Content>
    </Layout>
  );
};

export default POSLayout;
