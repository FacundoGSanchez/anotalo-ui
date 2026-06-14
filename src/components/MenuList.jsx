import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MenuItems from "../data/MenuItems";
import { useDevice } from "../context/DeviceContext";
import { useAuth } from "../context/AuthContext";

const filterItemsByPermission = (items, can) => {
  return items.reduce((acc, item) => {
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

const findMenuItem = (items, key) => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const { can } = useAuth();

  const visibleItems = filterItemsByPermission(MenuItems, can);

  const handleClick = ({ key }) => {
    const item = findMenuItem(MenuItems, key);
    if (item?.disabled) return;
    const route = item?.meta?.route?.[isMobile ? "mobile" : "desktop"] || key;
    navigate(route);
  };

  return (
    <Menu
      items={visibleItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      onClick={handleClick}
    />
  );
};

export default MenuList;
