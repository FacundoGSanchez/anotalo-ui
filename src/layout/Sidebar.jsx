import { Layout } from "antd";
import MenuList from "../components/MenuList";

const { Sider } = Layout;
const LOGO_PATH = "/images/Logo.png";

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      collapsedWidth={0} // <--- Ocultar completamente
      width={220} // <--- Ancho normal del sidebar
      breakpoint="md"
      trigger={null}
      theme="dark"
      className={`sidebar ${collapsed && isMobile ? "sidebar-hidden" : ""}`}
      onBreakpoint={(broken) => {
        if (broken) setCollapsed(true); // En mobile, ocultar automáticamente
      }}
    >
      {/* LOGO */}
      <div
        className="logo"
        style={{
          height: 64,
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
            backgroundColor: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: collapsed ? 0 : 10,
          }}
        >
          <img
            src={LOGO_PATH}
            alt="Logo Anótalo"
            style={{
              width: 32,
              height: 32,
            }}
          />
        </div>

        {!collapsed && (
          <h1
            style={{
              color: "#fff",
              fontSize: "1.1rem",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Anótalo
          </h1>
        )}
      </div>

      {/* MENÚ */}
      <MenuList
        darkTheme={true}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
      />
    </Sider>
  );
};

export default Sidebar;
