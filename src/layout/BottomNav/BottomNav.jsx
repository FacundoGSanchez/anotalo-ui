import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button, Divider, Avatar } from "antd";
import { useAuth } from "../../context/AuthContext";
import {
  MdHome,
  MdStore,
  MdListAlt,
  MdPeople,
  MdMoreHoriz,
  MdLogout,
  MdStorefront,
} from "react-icons/md";
import "./index.css";

const NAV_ITEMS = [
  {
    key: "inicio",
    icon: <MdHome />,
    label: "Inicio",
    route: "/",
  },
  {
    key: "pos",
    icon: <MdStore />,
    label: "POS",
    route: "/pos/anotalo",
  },
  {
    key: "movimientos",
    icon: <MdListAlt />,
    label: "Movimientos",
    route: "/movimientos",
  },
  {
    key: "nominas",
    icon: <MdPeople />,
    label: "Nóminas",
    route: "/entidades/clientes",
  },
  {
    key: "mas",
    icon: <MdMoreHoriz />,
    label: "Más",
    route: null,
  },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (route) => {
    if (!route) return false;
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  const handleNav = (item) => {
    if (item.key === "mas") {
      setMenuOpen(true);
      return;
    }
    navigate(item.route);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const activeItem = NAV_ITEMS.find((item) => isActive(item.route));

  return (
    <>
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav__item ${activeItem?.key === item.key ? "bottom-nav__item--active" : ""}`}
            onClick={() => handleNav(item)}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        ))}
      </nav>

      <Modal
        title={null}
        open={menuOpen}
        onCancel={() => setMenuOpen(false)}
        footer={null}
        closable={false}
        width={300}
        centered
        className="bottom-nav-modal"
      >
        <div className="bottom-nav-modal__content">
          <div className="bottom-nav-modal__user">
            <Avatar
              size={48}
              src={`${import.meta.env.BASE_URL}images/AvatarUser.webp`}
            />
            <div>
              <strong>{user?.nombre || user?.username || "Usuario"}</strong>
              <span className="bottom-nav-modal__role">
                {user?.rol || "Sin rol"}
              </span>
            </div>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div className="bottom-nav-modal__actions">
            <Button
              type="text"
              block
              icon={<MdStorefront />}
              onClick={() => {
                setMenuOpen(false);
                navigate("/entidades/proveedores");
              }}
              className="bottom-nav-modal__action"
            >
              Proveedores
            </Button>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Button
            type="text"
            block
            danger
            icon={<MdLogout />}
            onClick={handleLogout}
            className="bottom-nav-modal__action bottom-nav-modal__action--danger"
          >
            Cerrar Sesión
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BottomNav;
