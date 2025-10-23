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
    render: (text) => <span data-label="Denominación">{text}</span>,
  },
  // 💡 Nueva Columna: Tipo de Item
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
  // 💡 Nueva Columna Condicional: Stock
  {
    title: "Stock",
    dataIndex: "stock_actual",
    key: "stock_actual",
    render: (text, record) => (
      <span data-label="Stock">
        {record.tipo_item === "PRODUCTO" ? text : "N/A"}
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
