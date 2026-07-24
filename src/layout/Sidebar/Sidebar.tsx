import { Layout } from "antd";
import MenuList from "../../components/MenuList";
import "./index.css";

const { Sider } = Layout;
const LOGO_PATH = "/images/Logo.png";

const Sidebar = () => {
  return (
    <Sider className="sidebar" width={240} theme="dark">
      <div className="sidebar-logo">
        <div className="sidebar-logo__icon">
          <img src={LOGO_PATH} alt="Logo Anótalo" />
        </div>
        <h1 className="sidebar-logo__title">Anótalo</h1>
      </div>

      <div className="sidebar-menu">
        <MenuList darkTheme />
      </div>
    </Sider>
  );
};

export default Sidebar;
