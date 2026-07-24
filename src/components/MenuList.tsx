import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MenuItems from "../data/MenuItems";
import { useDevice } from "../context/DeviceContext";
import { useAuth } from "../context/AuthContext";
import { useMovimientoSession } from "../context/MovimientoSessionContext";

interface MenuItem {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  permiso?: { modulo: string; formulario: string };
  meta?: { route?: { mobile?: string; desktop?: string } };
  children?: MenuItem[];
  type?: string;
}

interface MenuListProps {
  darkTheme: boolean;
}

const filterItemsByPermission = (
  items: MenuItem[],
  can: (modulo: string, formulario: string) => boolean
): MenuItem[] => {
  return items.reduce<MenuItem[]>((acc, item) => {
    if (item.permiso && !can(item.permiso.modulo, item.permiso.formulario)) {
      return acc;
    }
    if (item.children) {
      const filteredChildren = filterItemsByPermission(item.children, can);
      if (filteredChildren.length === 0) return acc;
      return [...acc, { ...item, children: filteredChildren }];
    }
    return [...acc, item];
  }, []);
};

const findMenuItem = (items: MenuItem[], key: string): MenuItem | null => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const MenuList = ({ darkTheme }: MenuListProps) => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const { can } = useAuth();
  const { hasActiveItems, confirmExit } = useMovimientoSession();

  const visibleItems = filterItemsByPermission(MenuItems as MenuItem[], can);

  const handleClick = ({ key }: { key: string }) => {
    const item = findMenuItem(MenuItems as MenuItem[], key);
    if (item?.disabled) return;
    const route =
      item?.meta?.route?.[isMobile ? "mobile" : "desktop"] || key;
    if (hasActiveItems) {
      confirmExit(route, navigate);
    } else {
      navigate(route);
    }
  };

  return (
    <Menu
      tabIndex={-1}
      items={visibleItems as any[]}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      onClick={handleClick}
    />
  );
};

export default MenuList;
