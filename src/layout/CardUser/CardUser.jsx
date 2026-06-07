import { Avatar, Popover, Card, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import "./index.css";

const avatarUrl = `${import.meta.env.BASE_URL}images/AvatarUser.webp`;

const UserCardContent = ({ user, onLogout }) => (
  <Card className="user-card" styles={{ body: { padding: 10 } }}>
    <div className="user-card__content">
      <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />

      <div className="user-card__info">
        <h4 className="user-card__name">{user?.nombre || user?.username || "Usuario"}</h4>
        <p className="user-card__role">{user?.rol || "Sin rol"}</p>
        <p className="user-card__email">{user?.mail || ""}</p>
      </div>

      <Button type="primary" className="user-card__logout" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </div>
  </Card>
);

const CardUser = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Popover
      content={<UserCardContent user={user} onLogout={handleLogout} />}
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
