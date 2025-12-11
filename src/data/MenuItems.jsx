import {
  HomeOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  TagsOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Inicio</Link>,
    meta: { collapseOnClick: false },
  },
  {
    key: "gestion",
    icon: <FormOutlined />,
    label: "Nóminas",
    meta: { collapseOnClick: false },
    children: [
      {
        key: "/clients",
        icon: <UsergroupAddOutlined />,
        label: <Link to="/clients">Clientes</Link>,
        meta: { collapseOnClick: false },
      },
      {
        key: "/suppliers",
        icon: <DeliveredProcedureOutlined />,
        label: <Link to="/suppliers">Proveedores</Link>,
        meta: { collapseOnClick: false },
      },
      {
        key: "/items",
        icon: <TagsOutlined />,
        label: <Link to="/items">Ítems</Link>,
        meta: { collapseOnClick: false },
      },
    ],
  },
  {
    key: "/pos",
    icon: <ShopOutlined />,
    label: <Link to="/pos">Punto de Venta</Link>,
    meta: { collapseOnClick: true }, // ⬅️ SOLO este colapsa
  },
];

export default menuItems;
