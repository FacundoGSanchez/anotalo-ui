import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
  UserAddOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "/", // ruta real y única para Inicio
    icon: <HomeOutlined />,
    label: <Link to="/">Inicio</Link>,
  },
  {
    key: "clients", // key único para el grupo Clientes (no es ruta)
    icon: <TeamOutlined />,
    label: "Clientes",
    children: [
      {
        key: "/clients", // ruta real para listado
        icon: <BarsOutlined />,
        label: <Link to="/clients">Listado</Link>,
      },
      {
        key: "/clientsDetail", // ruta real para nuevo cliente
        icon: <UserAddOutlined />,
        label: <Link to="/clientsDetail">Nuevo</Link>,
      },
    ],
  },
  {
    key: "pos", 
    icon: <ShopOutlined />,
    label: (
      <span
        style={{ cursor: "pointer" }}
      >
        Venta
      </span>
    ),
  },
];

export default menuItems;
