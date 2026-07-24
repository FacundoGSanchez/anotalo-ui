import { Avatar, Popover, Card, Button, Divider, Typography, Select, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import type { Usuario, UsuarioSucursal, Organizacion, Session } from "@/types";
import "./index.css";

const { Text } = Typography;

const avatarUrl = `${import.meta.env.BASE_URL}images/AvatarUser.webp`;

interface UserCardContentProps {
  user: Usuario | null;
  session: Session | null;
  onLogout: () => void;
  onSwitchOrg: (orgId: number) => Promise<void>;
  onSwitchSucursal: (sucursalId: number) => void;
}

const UserCardContent = ({ user, session, onLogout, onSwitchOrg, onSwitchSucursal }: UserCardContentProps) => {
  const organizaciones: Organizacion[] = session?.organizaciones || [];
  const currentOrgId = authService.getCurrentOrgId();
  const orgActual = organizaciones.find((o) => o.id === currentOrgId) || organizaciones?.[0];

  const sucursales: UsuarioSucursal[] = session?.sucursales?.filter((s) => s.organizacionId === orgActual?.id) || [];
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
          {user?.roles?.includes(1) && organizaciones.length > 1 ? (
            <Select
              value={orgActual?.id}
              onChange={onSwitchOrg}
              style={{ width: "100%" }}
              options={organizaciones.map((o) => ({ value: o.id, label: o.nombre }))}
            />
          ) : (
            <Text strong style={{ fontSize: "13px", color: "#3f4a6d", display: "block" }}>
              {orgActual?.nombre || "Sin organización"}
            </Text>
          )}
        </div>

        {sucursales.length > 1 && (
          <div style={{ width: "100%" }}>
            <Divider style={{ margin: "8px 0" }} />
            <Text style={{ fontSize: "11px", color: "#8c8c8c", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              SUCURSAL ACTUAL
            </Text>
            <Select
              value={sucursalActual?.id}
              onChange={onSwitchSucursal}
              style={{ width: "100%" }}
              options={sucursales.map((s) => ({ value: s.id, label: s.nombre }))}
            />
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

  const handleLogout = (): void => {
    logout();
  };

  const handleSwitchOrg = async (orgId: number): Promise<void> => {
    try {
      await switchOrganization(orgId);
      message.success("Organización cambiada");
    } catch {
      message.error("Error al cambiar de organización");
    }
  };

  const handleSwitchSucursal = (sucursalId: number): void => {
    authService.switchSucursal(sucursalId);
    message.success("Sucursal cambiada");
  };

  return (
    <Popover
      content={<UserCardContent user={user} session={session} onLogout={handleLogout} onSwitchOrg={handleSwitchOrg} onSwitchSucursal={handleSwitchSucursal} />}
      trigger="hover"
      placement="bottomRight"
    >
      <span tabIndex={-1} style={{ display: "inline-flex" }}>
        <Avatar
          size="large"
          src={avatarUrl}
          icon={<UserOutlined />}
          className="card-user__avatar"
        />
      </span>
    </Popover>
  );
};

export default CardUser;
