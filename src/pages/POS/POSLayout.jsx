import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Modal,
  Table,
  DatePicker,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;
import { mockClients, mockProducts, columns } from "./POS_Data";
import { FaSearch } from "react-icons/fa";

const POSLayout = () => {
  const [client, setClient] = useState("");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(false);

  const [barcode, setBarcode] = useState("");
  const [productsPOS, setProductsPOS] = useState([]);
  const [date] = useState(dayjs());

  useEffect(() => {
    setClient("Consumidor Final");
    document.title = "Punto de Venta";
  }, []);

  // Modal client selection
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClient(client.name);
    setClientModalOpen(false);
  };

  const handleBarcodeEnter = () => {
    const code = barcode.trim();

    // Buscar el producto en la lista maestra
    const foundProduct = mockProducts.find((p) => p.barcode === code);

    if (!foundProduct) {
      console.warn("Producto no encontrado:", code);
      setBarcode("");
      return;
    }

    setProductsPOS((prevProducts) => {
      const index = prevProducts.findIndex((p) => p.barcode === code);

      if (index !== -1) {
        // Si ya existe, actualizar cantidad y total
        const updatedProducts = [...prevProducts];
        const existing = updatedProducts[index];
        const newQuantity = existing.quantity + 1;

        updatedProducts[index] = {
          ...existing,
          quantity: newQuantity,
          total: +(newQuantity * existing.price).toFixed(2),
        };

        return updatedProducts;
      } else {
        // Si no existe, agregarlo con cantidad 1 y total inicial
        return [
          ...prevProducts,
          {
            ...foundProduct,
            quantity: 1,
            total: +foundProduct.price.toFixed(2),
          },
        ];
      }
    });

    setBarcode("");
  };

  const total = productsPOS.reduce((acc, p) => acc + p.total, 0);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Title level={3}>Punto de Venta</Title>
      <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
        <Col flex="auto">
          <Text strong>Cliente:</Text>
          <Space>
            <Input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              style={{ width: 220, marginLeft: 10 }}
              readOnly
            />
            <Button
              type="primary"
              icon={<FaSearch />}
              onClick={() => setClientModalOpen(true)}
            />
          </Space>
        </Col>
        <Col>
          <Text strong>Fecha de Emisión:</Text>
          <DatePicker
            value={date}
            disabled
            style={{ marginLeft: 8 }}
            format="DD/MM/YYYY"
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Escanear código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={handleBarcodeEnter}
            autoFocus
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={productsPOS.map((p, i) => ({ ...p, key: i }))}
        pagination={false}
        locale={{ emptyText: "No hay productos agregados" }}
        style={{ marginBottom: 24 }}
        size="small"
      />

      <Row justify="end">
        <Col>
          <Text strong style={{ fontSize: 18, marginRight: 171 }}>
            Total: ${total.toFixed(2)}
          </Text>
        </Col>
      </Row>

      <Modal
        title="Seleccionar Cliente"
        open={clientModalOpen}
        onCancel={() => setClientModalOpen(false)}
        footer={null}
      >
        <ul style={{ padding: 0 }}>
          {mockClients.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <Button type="link" onClick={() => handleSelectClient(c)}>
                {c.name}
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default POSLayout;
