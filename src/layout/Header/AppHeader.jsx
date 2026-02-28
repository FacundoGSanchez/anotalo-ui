import { Layout, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../../context/DeviceContext";
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Header } = Layout;

const AppHeader = ({ collapsed, handleToggle }) => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  return (
    <Header
      className="app-header"
      style={{
        borderBottom: `1px solid ${colorBorderSecondary}`,
        padding: isMobile ? "0 16px" : "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* IZQUIERDA: Condicional según dispositivo */}
      <div className="app-header__left">
        {isMobile ? (
          // EN MOBILE: Solo botón Home
          <Button
            type="text"
            icon={<HomeOutlined style={{ fontSize: "20px" }} />}
            onClick={() => navigate("/")}
          />
        ) : (
          // EN DESKTOP: Botón Toggle Sidebar
          <Button
            onClick={handleToggle}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            className="app-header__menu-btn"
          />
        )}
      </div>

      {/* DERECHA */}
      <div className="app-header__right">
        <CardUser />
      </div>
    </Header>
  );
};

export default AppHeader;
