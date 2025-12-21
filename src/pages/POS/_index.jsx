import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Row, Col, Input, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import ArticuloItem from "./ArticuloItem";
import ResumenCarrito from "./ArticuloResumenCarrito";
import ArticuloHeader from "./ArticuloHeader";
import SelectSingleModal from "../../components/SelectSingleModal";
import { mockProducts, productColumns } from "../../data/mockData";

import "./pos.css";

const { Title } = Typography;

const POS = () => {
  const [listCarrito, setListCarrito] = useState([]);
  const [valuesResumentCarrito, setValuesResumentCarrito] = useState({
    itemsCount: 0,
    subtotal: 0,
    descuentos: 0,
    recargo: 0,
    total: 0,
  });
  const [openProductModal, setOpenProductModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) setListCarrito(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(listCarrito));

    const itemsCount = listCarrito.length;
    const subtotal = listCarrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );

    setValuesResumentCarrito({
      itemsCount,
      subtotal,
      descuentos: 0,
      recargo: 0,
      total: subtotal,
    });
  }, [listCarrito]);

  const handleSearchProduct = (value) => {
    setTimeout(() => setOpenProductModal(true), 50);
  };

  const handleSelectProduct = (articulo) => {
    setListCarrito((prev) => [
      ...prev,
      {
        ...articulo,
        cantidad: 1,
        difPeso: 0,
        difPorcentaje: 0,
        subtotal: articulo.precio,
      },
    ]);
  };

  const handleDeleteItem = useCallback(
    (id) => setListCarrito((prev) => prev.filter((item) => item.id !== id)),
    []
  );

  const handleUpdateItem = (id, updatedValues) => {
    setListCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  const carritoMemo = useMemo(() => listCarrito, [listCarrito]);

  return (
    <div className="pos-page">
      <div className="pos-container">
        <Title level={3} className="pos-title">
          Punto de Venta
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Row gutter={[16, 16]} className="pos-search-row">
              <Col xs={24}>
                <Input
                  placeholder="Buscar Artículo (código de barras o descripción)"
                  size="large"
                  onPressEnter={(e) => handleSearchProduct(e.target.value)}
                  suffix={<SearchOutlined className="pos-search-icon" />}
                  autoFocus
                />
              </Col>
            </Row>

            <ArticuloHeader />

            <List
              dataSource={carritoMemo}
              locale={{ emptyText: "El carrito está vacío." }}
              renderItem={(item) => (
                <List.Item className="pos-list-item">
                  <ArticuloItem
                    {...item}
                    onDelete={() => handleDeleteItem(item.id)}
                    onUpdate={handleUpdateItem}
                  />
                </List.Item>
              )}
              className="pos-list"
            />
          </Col>

          <Col xs={24} lg={6}>
            <ResumenCarrito data={valuesResumentCarrito} />
          </Col>
        </Row>
      </div>

      <SelectSingleModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        data={mockProducts}
        columns={productColumns}
        onSelect={handleSelectProduct}
      />
    </div>
  );
};

export default POS;
