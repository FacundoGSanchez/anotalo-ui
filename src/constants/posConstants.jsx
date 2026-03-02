import React from "react";
import {
  MdOutlineAddShoppingCart,
  MdOutlineLocalShipping,
  MdOutlineAccountBalanceWallet,
  MdOutlineAddCircleOutline,
  MdAttachMoney,
  MdCreditCard,
  MdCreditScore,
  MdSyncAlt,
  MdOutlineContactPage,
  MdQrCode2,
} from "react-icons/md";

export const MOVIMIENTO_TIPOS = {
  VENTA: "Venta",
  PAGO: "Pago",
  RETIRO: "Retiro",
  INGRESO: "Ingreso",
};

export const POS_COLORS = {
  [MOVIMIENTO_TIPOS.VENTA]: "#1890ff",
  [MOVIMIENTO_TIPOS.PAGO]: "#fa8c16",
  [MOVIMIENTO_TIPOS.INGRESO]: "#52c41a",
  [MOVIMIENTO_TIPOS.RETIRO]: "#546e7a",
  DEFAULT: "#d9d9d9",
};

export const OPCIONES_TIPO = [
  {
    key: MOVIMIENTO_TIPOS.VENTA,
    label: "Venta (Cliente)",
    icon: <MdOutlineAddShoppingCart />,
    desc: "Ingreso por ventas de productos",
  },
  {
    key: MOVIMIENTO_TIPOS.PAGO,
    label: "Pago (Proveedor)",
    icon: <MdOutlineLocalShipping />,
    desc: "Salida de dinero para pagos",
  },
  {
    key: MOVIMIENTO_TIPOS.INGRESO,
    label: "Ingreso (Caja)",
    icon: <MdOutlineAddCircleOutline />,
    desc: "Entrada interna de efectivo",
  },
  {
    key: MOVIMIENTO_TIPOS.RETIRO,
    label: "Retiro (Caja)",
    icon: <MdOutlineAccountBalanceWallet />,
    desc: "Salida interna de efectivo",
  },
];

export const FORMAS_PAGO = [
  {
    key: "Efectivo",
    label: "Efectivo",
    icon: <MdAttachMoney />,
    color: "#52c41a",
  },
  { key: "Debito", label: "Débito", icon: <MdCreditCard />, color: "#1890ff" },
  {
    key: "Credito",
    label: "Crédito",
    icon: <MdCreditScore />,
    color: "#722ed1",
  },
  {
    key: "Transferencia",
    label: "Transferencia",
    icon: <MdSyncAlt />,
    color: "#fa8c16",
  },
  {
    key: "Cta Corriente",
    label: "Cta. Corriente",
    icon: <MdOutlineContactPage />,
    color: "#eb2f96",
  },
  { key: "QR", label: "QR", icon: <MdQrCode2 />, color: "#13c2c2" },
];

// Helper para obtener solo los strings de nombres (útil para filtros y estados iniciales)
export const NOMBRES_FORMAS_PAGO = FORMAS_PAGO.map((f) => f.key);

export const VISOR_CONFIG = {
  MAX_DIGITOS: 12,
  SIZES: { DEFAULT: "48px", MEDIUM: "36px", SMALL: "28px" },
};

export const STEPS = {
  TIPO: 0,
  IMPORTE: 1,
  FORMA_PAGO: 2,
  ENTIDAD: 3,
  CONFIRMAR: 4,
};
