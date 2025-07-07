import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import menuItems from "../data/MenuItems.jsx";

const MenuList = ({ darkTheme }) => {
  const location = useLocation();

  return (
    <Menu
      items={menuItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      selectedKeys={[location.pathname]}
    />
  );
};

export default MenuList;
