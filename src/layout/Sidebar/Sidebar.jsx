import { Layout, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import MenuList from "../../components/MenuList";
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Sider } = Layout;
const { Text } = Typography;
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

      <div className="sidebar-footer">
        <CardUser />
      </div>
    </Sider>
  );
};

export default Sidebar;
