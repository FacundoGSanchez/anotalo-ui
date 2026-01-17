import { Avatar, Popover, Card, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./index.css";

const mockUser = {
  name: "Usuario",
  role: "Administrador",
  email: "test@organizacion.com",
  avatarUrl: `${import.meta.env.BASE_URL}images/AvatarUser.webp`,
};

const UserCardContent = ({ onLogout }) => (
  <Card className="user-card" styles={{ body: { padding: 10 } }}>
    <div className="user-card__content">
      <Avatar size={64} src={mockUser.avatarUrl} icon={<UserOutlined />} />

      <div className="user-card__info">
        <h4 className="user-card__name">{mockUser.name}</h4>
        <p className="user-card__role">{mockUser.role}</p>
        <p className="user-card__email">{mockUser.email}</p>
      </div>

      <Button type="primary" className="user-card__logout" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </div>
  </Card>
);

const CardUser = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Popover
      content={<UserCardContent onLogout={handleLogout} />}
      trigger="hover"
      placement="bottomRight"
    >
      <Avatar
        size="large"
        src={mockUser.avatarUrl}
        icon={<UserOutlined />}
        className="card-user__avatar"
      />
    </Popover>
  );
};

export default CardUser;
