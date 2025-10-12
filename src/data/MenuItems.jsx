import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
  BarsOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "/", // ruta real y única para Inicio
    icon: <HomeOutlined />,
    label: <Link to="/">Inicio</Link>,
  },
  {
    key: "nominas", // key único para el grupo Clientes (no es ruta)
    icon: <BarsOutlined />,
    label: "Nominas",
    children: [
      {
        key: "/clients", // ruta real para listado
        icon: <TeamOutlined />,
        label: <Link to="/clients">Clientes</Link>,
      },
      {
        key: "/providers", // ruta real para listado
        icon: <DropboxOutlined />,
        label: <Link to="/providers">Proveeodres</Link>,
      },
    ],
  },
  {
    key: "pos",
    icon: <ShopOutlined />,
    label: <span style={{ cursor: "pointer" }}>Venta</span>,
  },
];

export default menuItems;
