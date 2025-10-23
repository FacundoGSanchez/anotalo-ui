import { Button, Space } from "antd";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const getSupplierColumns = ({ onEdit, onDelete }) => [
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
  {
    title: "Teléfono",
    dataIndex: "telefono",
    key: "telefono",
    render: (text) => <span data-label="Teléfono">{text}</span>,
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

export default getSupplierColumns;
