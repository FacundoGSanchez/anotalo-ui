import {
  HomeOutlined,
  FormOutlined, // Nuevo ícono para Nóminas/Gestión
  UsergroupAddOutlined, // Nuevo ícono para Clientes
  DeliveredProcedureOutlined, // Nuevo ícono para Proveedores (Logística/Entrega)
  TagsOutlined, // Nuevo ícono para Ítems/Productos (Catálogo)
  ShopOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Inicio</Link>,
  },
  {
    key: "gestion", // Renombrado a 'gestion' si es un concepto más amplio
    icon: <FormOutlined />,
    label: "Gestión", // Renombrado de 'Nóminas' a 'Gestión' o el nombre que prefieras
    children: [
      {
        key: "/clients",
        icon: <UsergroupAddOutlined />, // Ícono más específico para Clientes
        label: <Link to="/clients">Clientes</Link>,
      },
      {
        key: "/suppliers", // Corregida la key para que coincida con la ruta de Link
        icon: <DeliveredProcedureOutlined />, // Ícono para Proveedores
        label: <Link to="/suppliers">Proveedores</Link>,
      },
      {
        key: "/items", // Corregida la key para que coincida con la ruta de Link
        icon: <TagsOutlined />, // Ícono para Catálogo/Ítems
        // 💡 Label adaptado a 'Ítems' (Productos y Servicios)
        label: <Link to="/items">Ítems</Link>,
      },
    ],
  },
  {
    key: "pos",
    icon: <ShopOutlined />,
    label: (
      <a href="/pos/registro" target="_blank" rel="noopener noreferrer">
        Punto de Venta
      </a>
    ),
  },
];

export default menuItems;
