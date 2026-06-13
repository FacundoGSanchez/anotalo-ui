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
      {
        key: "/pedidos",
        icon: <DeliveredProcedureOutlined />,
        label: "Pedidos",
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
      },
      {
        key: "/configuraciones/rubros",
        icon: <TagsOutlined />,
        label: "Rubros",
      },
      {
        key: "/configuraciones/formas-pago",
        icon: <CreditCardOutlined />,
        label: "Formas de Pago",
      },
    ],
  },

];

export default MenuItems;
