import { Layout, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuList from "../components/MenuList";
import ThogleThemeButtons from "../components/ThogleThemeButtons";
import Logo from "../components/logo";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="sidebar"
        theme={darkTheme ? "dark" : "light"}
      >
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ThogleThemeButtons darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>
        <Content
          style={{ margin: "16px", padding: 24, background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
