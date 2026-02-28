import {
  HomeOutlined,
  ShopOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const MenuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "Inicio",
    meta: { collapseOnClick: false },
  },
  {
    key: "/pos",
    icon: <ShopOutlined />,
    label: "Pos Anotalo",
    meta: {
      collapseOnClick: true,
      route: {
        mobile: "/pos/anotalo",
        desktop: "/pos/anotalo",
      },
    },
  },
  {
    key: "gestion",
    icon: <FormOutlined />,
    label: "Nóminas",
    children: [
      {
        // ✅ KEY ÚNICA: Coincide con la ruta dinámica de Clientes
        key: "/entidades/clientes",
        icon: <UsergroupAddOutlined />,
        label: "Clientes",
        disabled: false, // Activado
      },
      {
        // ✅ KEY ÚNICA: Coincide con la ruta dinámica de Proveedores
        key: "/entidades/proveedores",
        icon: <DeliveredProcedureOutlined />,
        label: "Proveedores",
        disabled: false, // Activado
      },
    ],
  },
  {
    key: "actividad", // Cambié la key de movimientos para evitar conflictos si el path es igual
    icon: <ProjectOutlined />,
    label: "Actividad",
    children: [
      {
        key: "/movimientos",
        icon: <UnorderedListOutlined />,
        label: "Movimientos",
        disabled: false,
      },
      {
        key: "/saldocuentas",
        icon: <UserSwitchOutlined />,
        label: "Saldo Cuentas",
        disabled: true,
      },
    ],
  },
];

export default MenuItems;
