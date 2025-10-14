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
    label: "Nominas",
    children: [
      {
        key: "/clients",
        icon: <TeamOutlined />,
        label: <Link to="/clients">Clientes</Link>,
      },
    ],
  },
  {
    key: "pos",
    icon: <ShopOutlined />,
    label: <Link to="/puntoventa">Punto Venta</Link>,
  },
];

export default menuItems;
