import React from "react";
import {
  MdStore,
  MdPeople,
  MdBarChart,
  MdAccountBalance,
  MdListAlt,
  MdSettings,
} from "react-icons/md";

export const MODULES = [
  {
    title: "OPERACIONES",
    items: [
      { key: "pos", icon: <MdStore size={20} />, label: "POS Anotalo", route: "/pos/anotalo" },
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
    title: "REPORTES",
    items: [
      { key: "rpt_caja", icon: <MdAccountBalance size={20} />, label: "Reporte Caja", route: "/reportes/caja" },
      { key: "rpt_ctacte", icon: <MdBarChart size={20} />, label: "Cta Corriente", route: "/reportes/ctacte" },
      { key: "movimientos", icon: <MdListAlt size={20} />, label: "Movimientos", route: "/movimientos" },
    ],
  },
  {
    title: "CONFIGURACIÓN",
    items: [
      { key: "formaspago", icon: <MdSettings size={20} />, label: "Formas de Pago", route: "/more/formas-pago" },
    ],
  },
];
