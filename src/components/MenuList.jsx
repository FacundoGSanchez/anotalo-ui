import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import menuItems from "../data/MenuItems.jsx";

const MenuList = ({ darkTheme, isMobile, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = ({ key }) => {
    navigate(key);

    // 👉 Si es mobile, colapsar (ocultar completamente)
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <Menu
      items={menuItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      selectedKeys={[location.pathname]}
      onClick={handleClick}
    />
  );
};

export default MenuList;
