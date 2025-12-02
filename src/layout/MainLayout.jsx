import { Layout, theme } from "antd";
import { useState, useMemo, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

const { Content } = Layout;

const MainLayout = () => {
  const { isMobile } = false;
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleBreakpoint = (broken) => {
    setCollapsed(broken);
  };

  const currentCollapsed = useMemo(() => collapsed, [collapsed]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        setCollapsed={setCollapsed}
        handleBreakpoint={handleBreakpoint}
        isMobile={isMobile}
        collapsed={currentCollapsed}
      />

      <Layout>
        <AppHeader collapsed={currentCollapsed} handleToggle={handleToggle} />

        <Content
          style={{ padding: 10, paddingLeft: 25, background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
