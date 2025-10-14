import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import menuItems from "../data/MenuItems.jsx";

const MenuList = ({ darkTheme, isMobile, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = ({ key }) => {
    // // Para evitar navegar con la key "pos" que no es ruta real
    // if (key === "pos") {
    //   // Abrir en nueva pestaña
    //   window.open("/pos", "_blank", "noopener,noreferrer");
    // } else {
    //   navigate(key);
    // }

    if (isMobile) {
      setCollapsed(true);
    }
  };

  // Función para calcular qué key(s) seleccionar
  // const getSelectedKeys = () => {
  //   const path = location.pathname;

  //   if (path.startsWith("/clientsDetail")) return ["/clientsDetail"];
  //   if (path.startsWith("/clients")) return ["/clients"];
  //   if (path.startsWith("/pos")) return ["/pos"];
  //   if (path === "/") return ["/"];
  //   // Nunca seleccionar "pos" porque se abre en pestaña nueva
  //   return [];
  // };

  return (
    <Menu
      items={menuItems}
      mode="inline"
      theme={darkTheme ? "dark" : "light"}
      //selectedKeys={getSelectedKeys()}
      onClick={handleClick}
    />
  );
};

export default MenuList;
