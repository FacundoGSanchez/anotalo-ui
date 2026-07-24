import { Layout, Button, theme, Tooltip, Typography } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { useDevice } from "../../context/DeviceContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { useCurrentSucursal } from "../../hooks/useCurrentSucursal";
import CardUser from "../CardUser/CardUser";
import "./index.css";

const { Text } = Typography;
const { Header } = Layout;

const AppHeader = () => {
  const { isMobile } = useDevice();
  const { session } = useAuth();
  const { sucursal } = useCurrentSucursal();
  const currentOrgId = authService.getCurrentOrgId();
  const currentOrg = session?.organizaciones?.find((o) => o.id === currentOrgId);
  const orgName = currentOrg?.nombre || session?.organizaciones?.[0]?.nombre || "ANOTALO";
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
      <div style={{ textAlign: "center" }}>
        <Text strong style={{ fontSize: "15px", color: "#3f4a6d", display: "block", lineHeight: 1.2 }}>
          {orgName}
        </Text>
        {sucursal && (
          <Text style={{ fontSize: "11px", color: "#8c8c8c", display: "block", lineHeight: 1.2 }}>
            {sucursal.nombre}
          </Text>
        )}
      </div>

      <div
        className="app-header__right"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        {installPrompt && (
          <Tooltip title="Instalar App">
            <Button
              tabIndex={-1}
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
