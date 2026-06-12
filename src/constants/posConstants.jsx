import React from "react";
import {
  MdOutlineAddShoppingCart,
  MdOutlineLocalShipping,
  MdAttachMoney,
  MdCreditCard,
  MdCreditScore,
  MdSyncAlt,
  MdOutlineContactPage,
  MdQrCode2,
  MdOutlinePayment,
} from "react-icons/md";

export const MOVIMIENTO_TIPOS = {
  VENTA: "Venta",
  PAGO: "Pago",
  RETIRO: "Retiro",
  INGRESO: "Ingreso",
  COBRO: "Cobro",
};

export const ICONOS_POS = {
  Efectivo: MdAttachMoney,
  TarjetaCredito: MdCreditCard,
  TarjetaDebito: MdCreditScore,
  Transferencia: MdSyncAlt,
  QR: MdQrCode2,
  CtaCorriente: MdOutlineContactPage,
};

export const POS_COLORS = {
  [MOVIMIENTO_TIPOS.VENTA]: "#1890ff",
  [MOVIMIENTO_TIPOS.PAGO]: "#fa8c16",
  [MOVIMIENTO_TIPOS.INGRESO]: "#52c41a",
  [MOVIMIENTO_TIPOS.RETIRO]: "#546e7a",
  [MOVIMIENTO_TIPOS.COBRO]: "#52c41a",
  DEFAULT: "#d9d9d9",
};

export const OPCIONES_TIPO = [];

export const FORMAS_PAGO = [
  {
    key: "Efectivo",
    label: "Efectivo",
    iconKey: "Efectivo",
    icon: <MdAttachMoney />,
    color: "#52c41a",
    requiereEntidad: false,
    impactaCaja: true,
    impactaCtaCte: false,
  },
  {
    key: "Cta Corriente",
    label: "Cuenta Corriente",
    iconKey: "CtaCorriente",
    icon: <MdOutlineContactPage />,
    color: "#eb2f96",
    requiereEntidad: true,
    impactaCaja: false,
    impactaCtaCte: true,
  },
  {
    key: "Tarjeta",
    label: "Tarjeta",
    iconKey: "TarjetaCredito",
    icon: <MdCreditCard />,
    color: "#1890ff",
    requiereEntidad: false,
    impactaCaja: false,
    impactaCtaCte: false,
  },
  {
    key: "QR",
    label: "QR",
    iconKey: "QR",
    icon: <MdQrCode2 />,
    color: "#00b4d8",
    requiereEntidad: false,
    impactaCaja: false,
    impactaCtaCte: false,
  },
  {
    key: "Transferencia",
    label: "Transferencia",
    iconKey: "Transferencia",
    icon: <MdSyncAlt />,
    color: "#722ed1",
    requiereEntidad: false,
    impactaCaja: false,
    impactaCtaCte: false,
  },
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
