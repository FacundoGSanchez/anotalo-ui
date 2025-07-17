import { Button, Space } from "antd";
import { FaTrash } from "react-icons/fa";

const mockClients = [
    { id: 1, name: "Consumidor Final" },
    { id: 2, name: "Juan Pérez" },
    { id: 3, name: "María López" },
    { id: 4, name: "Carlos García" },
  ];
  
  const mockProducts = [
    { id: 1,
      barcode: "1234567890123", 
      detail: "Coca Cola 500ml", 
      price: 115.5  
    }



  ];

  const columns = [
    {
      title: "Código Barra",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Detalle",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Precio Unit.",
      dataIndex: "price",
      key: "price",
      render: (value) => `$ ${value.toFixed(2)}`,
    },
    {
      align: "center",
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value) => `$ ${value.toFixed(2)}`,
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleDeleteProduct(record.barcode)}>
            <FaTrash />
          </Button>
        </Space>
      ),
    },
  ];
  
  export { mockClients, mockProducts, columns };