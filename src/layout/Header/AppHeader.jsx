import { Layout, Button, theme, Tooltip, Typography } from "antd";
import { HomeOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../../context/DeviceContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useAuth } from "../../context/AuthContext";
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Text } = Typography;
const { Header } = Layout;

const AppHeader = () => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { session } = useAuth();
  const orgName = session?.organizaciones?.[0]?.nombre || "ANOTALO";
  const { installPrompt, handleInstallClick } = usePWAInstall();
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
      <div className="app-header__left">
        <Button
          type="text"
          icon={<HomeOutlined style={{ fontSize: "20px" }} />}
          onClick={() => navigate("/")}
        />
      </div>

      <Text strong style={{ fontSize: "15px", color: "#1890ff" }}>
        {orgName}
      </Text>

      <div
        className="app-header__right"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        {installPrompt && (
          <Tooltip title="Instalar App">
            <Button
              type="default"
              size="middle"
              icon={<CloudDownloadOutlined />}
              onClick={handleInstallClick}
            >
              Instalar App
            </Button>
          </Tooltip>
        )}

        <CardUser />
      </div>
    </Header>
  );
};

export default AppHeader;
