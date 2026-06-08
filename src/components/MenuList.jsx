import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MenuItems from "../data/MenuItems";
import { useDevice } from "../context/DeviceContext";

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

  const handleClick = ({ key }) => {
    const item = findMenuItem(MenuItems, key);
    if (item?.disabled) return;
    const route = item?.meta?.route?.[isMobile ? "mobile" : "desktop"] || key;
    navigate(route);
  };

  return (
    <Menu
      items={MenuItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      onClick={handleClick}
    />
  );
};

export default MenuList;
