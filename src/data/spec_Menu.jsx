import React from "react";
import {
  MdStore,
  MdPeople,
  MdBarChart,
  MdAccountBalance,
  MdListAlt,
  MdShoppingCart,
  MdAssignment,
  MdSettings,
  MdLabel,
  MdCreditCard,
} from "react-icons/md";

export const MODULES = [
  {
    title: "OPERACIONES",
    items: [
      { key: "pos", icon: <MdStore size={20} />, label: "POS Anotalo", route: "/pos/anotalo" },
      { key: "movimientos", icon: <MdListAlt size={20} />, label: "Movimientos", route: "/movimientos" },
    ],
  },
  {
    title: "ENTIDADES",
    items: [
      { key: "clientes", icon: <MdPeople size={20} />, label: "Clientes", route: "/entidades/clientes" },
      { key: "proveedores", icon: <MdPeople size={20} />, label: "Proveedores", route: "/entidades/proveedores" },
    ],
  },
  {
    title: "GESTIONES",
    items: [
      { key: "rpt_caja", icon: <MdAccountBalance size={20} />, label: "Caja", route: "/gestiones/caja" },
      { key: "rpt_ctacte", icon: <MdBarChart size={20} />, label: "Cta Corriente", route: "/gestiones/ctacte" },
      { key: "rpt_saldo_ctas_ctes", icon: <MdAccountBalance size={20} />, label: "Saldo Ctas Ctes", route: "/reportes/saldo-ctas-ctes" },
      { key: "rpt_resumen_ventas", icon: <MdBarChart size={20} />, label: "Resumen Ventas", route: "/reportes/resumen-ventas" },
    ],
  },
  {
    title: "COMPRAS",
    items: [
      { key: "compras", icon: <MdShoppingCart size={20} />, label: "Compras", route: "/compras" },
      { key: "pedidos", icon: <MdAssignment size={20} />, label: "Pedidos", route: "/pedidos" },
    ],
  },
  {
    title: "CONFIGURACIONES",
    items: [
      { key: "cfg_pos", icon: <MdSettings size={20} />, label: "Config POS", route: "/configuraciones/pos" },
      { key: "cfg_rubros", icon: <MdLabel size={20} />, label: "Rubros", route: "/configuraciones/rubros" },
      { key: "cfg_formas_pago", icon: <MdCreditCard size={20} />, label: "Formas de Pago", route: "/configuraciones/formas-pago" },
    ],
  },
];
