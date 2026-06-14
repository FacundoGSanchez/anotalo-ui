import { Avatar, Popover, Card, Button, Divider, Typography, message } from "antd";
import { UserOutlined, SwapOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import "./index.css";

const { Text } = Typography;

const avatarUrl = `${import.meta.env.BASE_URL}images/AvatarUser.webp`;

const UserCardContent = ({ user, session, onLogout, onSwitchOrg, onSwitchSucursal }) => {
  const organizaciones = session?.organizaciones || [];
  const currentOrgId = authService.getCurrentOrgId();
  const orgActual = organizaciones.find((o) => o.id === currentOrgId) || organizaciones?.[0];

  const sucursales = session?.sucursales?.filter((s) => s.organizacionId === orgActual?.id) || [];
  const currentSucursalId = authService.getCurrentSucursalId();
  const sucursalActual = sucursales.find((s) => s.id === currentSucursalId) || sucursales?.[0];

  return (
    <Card className="user-card" styles={{ body: { padding: 10 } }}>
      <div className="user-card__content">
        <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />

        <div className="user-card__info">
          <h4 className="user-card__name">{user?.nombre || user?.username || "Usuario"}</h4>
          <p className="user-card__role">{user?.rol || "Sin rol"}</p>
          <p className="user-card__email">{user?.mail || ""}</p>
        </div>

        <Divider style={{ margin: "8px 0" }} />
        <div style={{ width: "100%" }}>
          <Text style={{ fontSize: "11px", color: "#8c8c8c", fontWeight: 700, display: "block", marginBottom: "8px" }}>
            ORGANIZACIÓN ACTUAL
          </Text>
          <Text strong style={{ fontSize: "13px", color: "#3f4a6d", display: "block", marginBottom: "8px" }}>
            {orgActual?.nombre || "Sin organización"}
          </Text>
          {user?.roles?.includes(1) && organizaciones.length > 1 && organizaciones
            .filter((o) => o.id !== orgActual?.id)
            .map((org) => (
                  <Button
                    key={org.id}
                    type="default"
                    block
                    icon={<SwapOutlined />}
                    style={{
                      borderRadius: "8px",
                      height: "36px",
                      fontSize: "13px",
                      borderColor: "#1890ff",
                      color: "#1890ff",
                      marginBottom: "4px",
                    }}
                    onClick={() => onSwitchOrg(org.id)}
                  >
                    Cambiar a {org.nombre}
                  </Button>
                ))}
            </div>

        {sucursales.length > 1 && (
          <div style={{ width: "100%" }}>
            <Divider style={{ margin: "8px 0" }} />
            <Text style={{ fontSize: "11px", color: "#8c8c8c", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              SUCURSAL ACTUAL
            </Text>
            <Text strong style={{ fontSize: "13px", color: "#3f4a6d", display: "block", marginBottom: "8px" }}>
              {sucursalActual?.nombre || "Sin sucursal"}
            </Text>
            {sucursales
              .filter((s) => s.id !== sucursalActual?.id)
              .map((s) => (
                <Button
                  key={s.id}
                  type="default"
                  block
                  icon={<SwapOutlined />}
                  style={{
                    borderRadius: "8px",
                    height: "36px",
                    fontSize: "13px",
                    borderColor: "#3f4a6d",
                    color: "#3f4a6d",
                    marginBottom: "4px",
                  }}
                  onClick={() => onSwitchSucursal(s.id)}
                >
                  Cambiar a {s.nombre}
                </Button>
              ))}
          </div>
        )}

        <Divider style={{ margin: "8px 0" }} />

        <Button
          type="primary"
          className="user-card__logout"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          block
        >
          Cerrar Sesión
        </Button>
      </div>
    </Card>
  );
};

const CardUser = () => {
  const { user, session, logout, switchOrganization } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleSwitchOrg = async (orgId) => {
    try {
      await switchOrganization(orgId);
      message.success("Organización cambiada");
    } catch {
      message.error("Error al cambiar de organización");
    }
  };

  const handleSwitchSucursal = (sucursalId) => {
    authService.switchSucursal(sucursalId);
    message.success("Sucursal cambiada");
  };

  return (
    <Popover
      content={<UserCardContent user={user} session={session} onLogout={handleLogout} onSwitchOrg={handleSwitchOrg} onSwitchSucursal={handleSwitchSucursal} />}
      trigger="hover"
      placement="bottomRight"
    >
      <Avatar
        size="large"
        src={avatarUrl}
        icon={<UserOutlined />}
        className="card-user__avatar"
      />
    </Popover>
  );
};

export default CardUser;
