import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import menuItems from "../data/MenuItems.jsx";

// ✅ Función recursiva para encontrar un item por su key
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

const MenuList = ({ darkTheme, isMobile, setCollapsed }) => {
  const navigate = useNavigate();

  const handleClick = ({ key }) => {
    const item = findMenuItem(menuItems, key);

    // Navegar
    navigate(key);

    // Colapsar solo si meta.collapseOnClick === true
    if (isMobile || item?.meta?.collapseOnClick) {
      setCollapsed(true);
    }
  };

  return (
    <Menu
      items={menuItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      onClick={handleClick}
    />
  );
};

export default MenuList;
