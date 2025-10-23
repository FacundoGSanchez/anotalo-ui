// Este campo es CLAVE para diferenciar en el listado y en el PDV
const initialListItem = [
  {
    key: "1",
    id: 1,
    denominacion: "Pan Blanco de Molde",
    telefono: "N/A", // Se mantiene por la estructura, pero podría eliminarse en el futuro
    tipo_item: "PRODUCTO", // 💡 Campo clave
    stock_actual: 50,
  },
  {
    key: "2",
    id: 2,
    denominacion: "Empaques de Cartón",
    telefono: "N/A",
    tipo_item: "PRODUCTO", // 💡 Campo clave
    stock_actual: 100,
  },
  {
    key: "3",
    id: 3,
    denominacion: "Asesoría de Negocios",
    telefono: "N/A",
    tipo_item: "SERVICIO", // 💡 Campo clave
    stock_actual: 0, // No aplica
  },
];

export { initialListItem };
