import MenuList from "../components/MenuList";
import { Layout } from "antd";

const { Sider } = Layout;
const LOGO_PATH = "/images/Logo.png";

const Sidebar = ({ collapsed, handleBreakpoint, isMobile, setCollapsed }) => {
  const logoImageSize = 32;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 80}
      breakpoint="md"
      trigger={null}
      className="sidebar"
      theme="dark"
      onBreakpoint={handleBreakpoint}
    >
      <div
        className="logo"
        style={{
          height: 64,
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "16px 0" : "16px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFF",
            marginRight: collapsed ? 0 : 10,
          }}
        >
          <img
            src={LOGO_PATH}
            alt="Logo Anótalo"
            style={{
              width: logoImageSize,
              height: logoImageSize,
            }}
          />
        </div>

        {!collapsed && (
          <h1
            style={{
              color: "white",
              fontSize: "1.2rem",
              margin: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Anótalo
          </h1>
        )}
      </div>

      <MenuList
        darkTheme={true}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
      />
    </Sider>
  );
};

export default Sidebar;
