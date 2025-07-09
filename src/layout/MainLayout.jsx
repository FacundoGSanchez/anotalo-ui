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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleToggle = () => {
    if (isMobile) {
      setMobileCollapsed((prev) => !prev);
    } else {
      setDesktopCollapsed((prev) => !prev);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={isMobile ? mobileCollapsed : desktopCollapsed}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="md"
        trigger={null}
        className="sidebar"
        theme={darkTheme ? "dark" : "light"}
        onBreakpoint={(broken) => {
          setIsMobile(broken);
          setMobileCollapsed(broken); // ocultar automáticamente en mobile
        }}
      >
        <Logo />
        <MenuList
          darkTheme={darkTheme}
          isMobile={isMobile}
          setCollapsed={setMobileCollapsed}
        />
        <ThogleThemeButtons darkTheme={darkTheme} toggleTheme={toggleTheme} />
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
              (isMobile ? mobileCollapsed : desktopCollapsed) ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
          />
        </Header>

        <Content
          style={{ margin: "5px", padding: 10, background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
