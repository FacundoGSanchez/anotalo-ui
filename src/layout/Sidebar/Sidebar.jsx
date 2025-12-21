import { Layout } from "antd";
import MenuList from "../../components/MenuList";
import "./index.css";

const { Sider } = Layout;
const LOGO_PATH = "/images/Logo.png";

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <Sider
      className="sidebar"
      collapsible
      collapsed={collapsed}
      collapsedWidth={0}
      width={220}
      breakpoint="md"
      trigger={null}
      theme="dark"
      onBreakpoint={(broken) => {
        if (broken) setCollapsed(true);
      }}
    >
      {/* LOGO */}
      <div className={`sidebar-logo ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo__icon">
          <img src={LOGO_PATH} alt="Logo Anótalo" />
        </div>

        {!collapsed && <h1 className="sidebar-logo__title">Anótalo</h1>}
      </div>

      {/* MENÚ */}
      <MenuList darkTheme setCollapsed={setCollapsed} />
    </Sider>
  );
};

export default Sidebar;
