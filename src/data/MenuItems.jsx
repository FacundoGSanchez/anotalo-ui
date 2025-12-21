import {
  HomeOutlined,
  ShopOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  TagsOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  TableOutlined,
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
    label: "Punto de Venta",
    meta: {
      collapseOnClick: true,
      route: {
        mobile: "/pos/anotalo",
        desktop: "/pos",
      },
    },
  },
  {
    key: "gestion",
    icon: <FormOutlined />,
    label: "Nóminas",
    children: [
      {
        key: "/clients",
        icon: <UsergroupAddOutlined />,
        label: "Clientes",
      },
      {
        key: "/suppliers",
        icon: <DeliveredProcedureOutlined />,
        label: "Proveedores",
      },
      {
        key: "/items",
        icon: <TagsOutlined />,
        label: "Ítems",
      },
    ],
  },
  {
    key: "movimientos",
    icon: <ProjectOutlined />,
    label: "Actividad",
    children: [
      {
        key: "/movimientos",
        icon: <UnorderedListOutlined />,
        label: "Movimientos",
      },
      {
        key: "/stock",
        icon: <TableOutlined />,
        label: "Stock",
      },
      {
        key: "/saldocuentas",
        icon: <UserSwitchOutlined />,
        label: "Saldo Cuentas",
      },
    ],
  },
];

export default MenuItems;
