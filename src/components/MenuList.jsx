import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import menuItems from "../data/menuItems";
import { useDevice } from "../context/DeviceContext";

// buscar item recursivamente
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

const MenuList = ({ darkTheme, setCollapsed }) => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const handleClick = ({ key }) => {
    const item = findMenuItem(menuItems, key);

    const route = item?.meta?.route?.[isMobile ? "mobile" : "desktop"] || key;

    navigate(route);

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
