import { Layout, theme } from "antd";
import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import AppHeader from "./Header/AppHeader";
import BottomNav from "./BottomNav/BottomNav";
import { useDevice } from "../context/DeviceContext";
import "./index.css";

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isMobile } = useDevice();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const currentCollapsed = useMemo(() => collapsed, [collapsed]);

  return (
    <Layout className="main-layout" style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sidebar collapsed={currentCollapsed} setCollapsed={setCollapsed} />
      )}

      <Layout className="main-layout__content">
        {!isMobile && (
          <AppHeader collapsed={currentCollapsed} handleToggle={handleToggle} />
        )}

        <Content
          className="main-layout__page"
          style={{ background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>

      {isMobile && <BottomNav />}
    </Layout>
  );
};

export default MainLayout;
