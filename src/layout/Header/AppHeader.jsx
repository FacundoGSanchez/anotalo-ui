import { Layout, Button, theme, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CloudDownloadOutlined, // Icono sugerido para instalación
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../../context/DeviceContext";
import { usePWAInstall } from "../../hooks/usePWAInstall"; // Importamos el hook
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Header } = Layout;

const AppHeader = ({ collapsed, handleToggle }) => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { installPrompt, handleInstallClick } = usePWAInstall(); // Hook de PWA
  const {
    token: { colorBorderSecondary, colorPrimary },
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
      <div className="app-header__left">
        {isMobile ? (
          <Button
            type="text"
            icon={<HomeOutlined style={{ fontSize: "20px" }} />}
            onClick={() => navigate("/")}
          />
        ) : (
          <Button
            onClick={handleToggle}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            className="app-header__menu-btn"
          />
        )}
      </div>

      <div
        className="app-header__right"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        {/* BOTÓN DE INSTALACIÓN PWA */}
        {installPrompt && (
          <Tooltip title="Instalar App">
            <Button
              type={isMobile ? "primary" : "default"}
              shape={isMobile ? "round" : "default"}
              size={isMobile ? "small" : "middle"}
              icon={<CloudDownloadOutlined />}
              onClick={handleInstallClick}
              style={isMobile ? { fontSize: "12px" } : {}}
            >
              {!isMobile && "Instalar App"}
            </Button>
          </Tooltip>
        )}

        <CardUser />
      </div>
    </Header>
  );
};

export default AppHeader;
