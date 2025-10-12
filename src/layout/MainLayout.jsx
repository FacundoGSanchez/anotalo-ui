import { Layout, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuList from "../components/MenuList";
// import Logo from "../components/logo"; // Dejé esta línea como estaba en tu código (comentada)

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleBreakpoint = (broken) => {
    setIsMobile(broken);
    setCollapsed(broken);
  };

  const currentCollapsed = collapsed;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={currentCollapsed}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="md"
        trigger={null}
        className="sidebar"
        theme="dark"
        onBreakpoint={handleBreakpoint}
      >
        <MenuList
          darkTheme={true}
          isMobile={isMobile}
          setCollapsed={setCollapsed}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleToggle}
            type="text"
            icon={
              currentCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
          />
        </Header>

        <Content style={{ padding: 10, background: colorBgContainer }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
