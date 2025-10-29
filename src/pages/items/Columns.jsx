import { Button, Space, Tag } from "antd";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const getItemColumns = ({ onEdit, onDelete }) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <span data-label="ID">{text}</span>,
  },
  {
    title: "Denominación",
    dataIndex: "denominacion",
    key: "denominacion",
    // 💡 Render modificado para incluir la denominación y el código de barras
    render: (text, record) => (
      <div data-label="Denominación">
        {/* 1. Denominación (Texto principal) */}
        <span style={{ display: "block" }}>{text}</span>

        {/* 2. Leyenda del Código de Barras (Solo si existe y es un producto) */}
        {record.codigo_barras && record.tipo_item === "PRODUCTO" && (
          <span
            style={{
              display: "block",
              fontSize: "0.75em", // Letra más chica
              fontStyle: "italic", // En cursiva
              color: "#888", // Un color más discreto
              marginTop: "2px",
            }}
          >
            Cód. Barras: {record.codigo_barras}
          </span>
        )}
      </div>
    ),
  },
  // ❌ Columna de Código de Barras eliminada
  /*
  {
    title: "Cód. Barras",
    dataIndex: "codigo_barras",
    key: "codigo_barras",
    render: (text) => (
      <span data-label="Cód. Barras">
        {text ? text : "N/A"}
      </span>
    ),
  },
  */
  // Columna: Tipo de Item
  {
    title: "Tipo",
    dataIndex: "tipo_item",
    key: "tipo_item",
    render: (text) => {
      const color = text === "PRODUCTO" ? "blue" : "green";
      const display = text === "PRODUCTO" ? "PRODUCTO" : "SERVICIO";
      return <Tag color={color}>{display}</Tag>;
    },
  },
  // Columna: Precio de Venta
  {
    title: "Precio Venta",
    dataIndex: "precio",
    key: "precio",
    render: (text) => (
      <span data-label="Precio Venta">
        {text ? `$ ${parseFloat(text).toFixed(2)}` : "$ 0.00"}
      </span>
    ),
  },
  {
    title: "Acciones",
    key: "acciones",
    render: (_, record) => (
      <Space>
        <Button
          type="text"
          onClick={() => onEdit(record)}
          className="action-icon-button"
        >
          <FaEdit size={24} color="#1890ff" />
        </Button>
        <Button
          type="text"
          danger
          onClick={() => onDelete(record)}
          className="action-icon-button"
        >
          <FaTrashAlt size={24} color="#ff4d4f" />
        </Button>
      </Space>
    ),
  },
];

export default getItemColumns;
