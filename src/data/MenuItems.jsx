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
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Inicio</Link>,
  },
  {
    key: "clients",
    icon: <TeamOutlined />,
    label: "Clientes",
    children: [
      {
        key: "/clients",
        icon: <BarsOutlined />,
        label: <Link to="/clients">Listado</Link>,
      },
      {
        key: "/clientsDetail",
        icon: <UserAddOutlined />,
        label: <Link to="/clientsDetail">Nuevo</Link>,
      },
    ],
  },
  {
    key: "/pos",
    icon: <ShopOutlined />,
    label: <Link to="/pos">Venta</Link>,
  },
];

export default menuItems;
