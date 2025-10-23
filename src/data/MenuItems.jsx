import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
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
    key: "nominas",
    icon: <BarsOutlined />,
    label: "Nóminas",
    children: [
      {
        key: "/clients",
        icon: <TeamOutlined />,
        label: <Link to="/clients">Clientes</Link>,
      },
      {
        key: "/proveedores",
        icon: <TeamOutlined />,
        label: <Link to="/suppliers">Proveedores</Link>,
      },
      {
        key: "/productos",
        icon: <TeamOutlined />,
        label: <Link to="/items">Productos</Link>,
      },
    ],
  },
  {
    key: "pos",
    icon: <ShopOutlined />,
    // 👇 Acá abrimos el punto de venta en una nueva pestaña
    label: (
      <a href="/pos/registro" target="_blank" rel="noopener noreferrer">
        Punto de Venta
      </a>
    ),
  },
];

export default menuItems;
