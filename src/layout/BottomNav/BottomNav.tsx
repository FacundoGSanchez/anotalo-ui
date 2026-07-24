import { useNavigate, useLocation } from "react-router-dom";
import { MdHome, MdStore, MdListAlt, MdPeople, MdMoreHoriz } from "react-icons/md";
import { useMovimientoSession } from "../../context/MovimientoSessionContext";
import "./index.css";

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  route: string | null;
  featured?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "inicio",
    icon: <MdHome />,
    label: "Inicio",
    route: "/",
  },
  {
    key: "movimientos",
    icon: <MdListAlt />,
    label: "Movimientos",
    route: "/movimientos",
  },
  {
    key: "pos",
    icon: <MdStore />,
    label: "POS",
    route: "/pos/anotalo",
    featured: true,
  },
  {
    key: "nominas",
    icon: <MdPeople />,
    label: "Nóminas",
    route: "/entidades",
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
  const { hasActiveItems, confirmExit } = useMovimientoSession();

  const isActive = (route: string | null): boolean => {
    if (!route) return false;
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  const handleNav = (item: NavItem): void => {
    if (item.key === "mas") {
      if (hasActiveItems) {
        confirmExit("/more", navigate);
      } else {
        navigate("/more");
      }
      return;
    }
    if (hasActiveItems) {
      confirmExit(item.route as string, navigate);
    } else {
      navigate(item.route as string);
    }
  };

  const activeItem = NAV_ITEMS.find((item) => isActive(item.route));

  const nominaActive = location.pathname.startsWith("/entidades");

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          className={`bottom-nav__item ${item.featured ? "bottom-nav__item--featured" : ""} ${(item.key === "nominas" ? nominaActive : activeItem?.key === item.key) ? "bottom-nav__item--active" : ""}`}
          onClick={() => handleNav(item)}
        >
          {item.featured ? (
            <span className="bottom-nav__icon-wrapper">
              <span className="bottom-nav__icon">{item.icon}</span>
            </span>
          ) : (
            <span className="bottom-nav__icon">{item.icon}</span>
          )}
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
