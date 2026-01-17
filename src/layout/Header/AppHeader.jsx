import { Layout, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Header } = Layout;

const AppHeader = ({ collapsed, handleToggle }) => {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  return (
    <Header
      className="app-header"
      style={{ borderBottom: `1px solid ${colorBorderSecondary}` }}
    >
      {/* IZQUIERDA */}
      <div className="app-header__left">
        <Button
          onClick={handleToggle}
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="app-header__menu-btn"
        />
      </div>

      {/* DERECHA */}
      <div className="app-header__right">
        <CardUser />
      </div>
    </Header>
  );
};

export default AppHeader;
