import {
  HomeOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  UnorderedListOutlined,
  BankOutlined,
  FileTextOutlined,
  SettingOutlined,
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
    label: "REPORTES",
    type: "group",
    children: [
      {
        key: "/reportes/caja",
        icon: <BankOutlined />,
        label: "Reporte Caja",
      },
      {
        key: "/reportes/ctacte",
        icon: <FileTextOutlined />,
        label: "Cta Corriente",
      },
      {
        key: "/movimientos",
        icon: <UnorderedListOutlined />,
        label: "Movimientos",
      },
    ],
  },
  {
    key: "cfg_group",
    label: "CONFIGURACIÓN",
    type: "group",
    children: [
      {
        key: "/more/formas-pago",
        icon: <SettingOutlined />,
        label: "Formas de Pago",
      },
    ],
  },
];

export default MenuItems;
