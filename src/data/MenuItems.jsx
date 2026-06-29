import {
  HomeOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  UnorderedListOutlined,
  BankOutlined,
  FileTextOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  AccountBookOutlined,
  ToolOutlined,
  CreditCardOutlined,
  TagsOutlined,
  ApartmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const MenuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "Inicio",
  },
  {
    type: "divider",
  },
  {
    key: "op_group",
    label: "OPERACIONES",
    type: "group",
    children: [
      {
        key: "/pos/anotalo",
        icon: <ShopOutlined />,
        label: "POS Anotalo",
      },
    ],
  },
  {
    key: "ent_group",
    label: "ENTIDADES",
    type: "group",
    children: [
      {
        key: "/entidades/clientes",
        icon: <UsergroupAddOutlined />,
        label: "Clientes",
      },
      {
        key: "/entidades/proveedores",
        icon: <DeliveredProcedureOutlined />,
        label: "Proveedores",
      },
    ],
  },
  {
    key: "rpt_group",
    label: "GESTIONES",
    type: "group",
    children: [
      {
        key: "/gestiones/caja",
        icon: <BankOutlined />,
        label: "Caja",
      },
      {
        key: "/gestiones/ctacte",
        icon: <FileTextOutlined />,
        label: "Cta Corriente",
      },
      {
        key: "/reportes/saldo-ctas-ctes",
        icon: <AccountBookOutlined />,
        label: "Saldo Ctas Ctes",
      },
      {
        key: "/movimientos",
        icon: <UnorderedListOutlined />,
        label: "Movimientos",
      },
      {
        key: "/reportes/resumen-ventas",
        icon: <BarChartOutlined />,
        label: "Resumen Ventas",
      },
    ],
  },
  {
    key: "comp_group",
    label: "COMPRAS",
    type: "group",
    children: [
      {
        key: "/compras",
        icon: <ShoppingCartOutlined />,
        label: "Compras",
      },
    ],
  },
  {
    key: "cfg_group",
    label: "CONFIGURACIONES",
    type: "group",
    children: [
      {
        key: "/configuraciones/pos",
        icon: <ToolOutlined />,
        label: "Config POS",
        permiso: { modulo: "CONFIG", formulario: "pos" },
      },
      {
        key: "/configuraciones/rubros",
        icon: <TagsOutlined />,
        label: "Rubros",
        permiso: { modulo: "CONFIG", formulario: "rubros" },
      },
      {
        key: "/configuraciones/formas-pago",
        icon: <CreditCardOutlined />,
        label: "Formas de Pago",
        permiso: { modulo: "CONFIG", formulario: "formas-pago" },
      },
      {
        key: "/configuraciones/sucursales",
        icon: <ApartmentOutlined />,
        label: "Sucursales",
        permiso: { modulo: "CONFIG", formulario: "sucursales" },
      },
      {
        key: "/configuraciones/usuarios",
        icon: <TeamOutlined />,
        label: "Usuarios",
        permiso: { modulo: "CONFIG", formulario: "usuarios" },
      },
    ],
  },

];

export default MenuItems;
