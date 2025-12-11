import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Row, Col, Input, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import ArticuloItem from "./ArticuloItem";
import ResumenCarrito from "./ArticuloResumenCarrito";

import { mockProducts, productColumns } from "../../data/mockData";
import SelectSingleModal from "../../components/SelectSingleModal";
import ArticuloHeader from "./ArticuloHeader";

const { Title } = Typography;

const containerElevationStyle = {
  boxShadow:
    "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
  borderRadius: "8px",
  padding: "20px",
  backgroundColor: "#fff",
};

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
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) {
      setListCarrito(JSON.parse(saved));
    }
  }, []);

  // ---------------------------
  // Guardar carrito + calcular resumen
  // ---------------------------
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(listCarrito));

    const itemsCount = listCarrito.length;
    const subtotal = listCarrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );

    const descuentos = 0;
    const recargo = 0;
    const total = subtotal - descuentos + recargo;

    setValuesResumentCarrito({
      itemsCount,
      subtotal,
      descuentos,
      recargo,
      total,
    });
  }, [listCarrito]);

  // ---------------------------
  // Abrir modal al presionar ENTER
  // ---------------------------
  const handleSearchProduct = (value) => {
    setSearchValue(value);
    setTimeout(() => setOpenProductModal(true), 50);
  };

  // ---------------------------
  // Seleccionar producto
  // ---------------------------
  const handleSelectProduct = (articulo) => {
    setListCarrito((prev) => [
      ...prev,
      {
        id: articulo.id,
        detalle: articulo.detalle,
        precio: articulo.precio,
        cantidad: 1,
        difPeso: 0,
        difPorcentaje: 0,
        subtotal: articulo.precio,
        ...articulo,
      },
    ]);
  };

  // ---------------------------
  // Eliminar producto del carrito
  // ---------------------------
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

  // ---------------------------
  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div style={containerElevationStyle}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Punto de Venta
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col xs={24}>
                <Input
                  placeholder="Buscar Artículo (código de barras o descripción)"
                  size="large"
                  onPressEnter={(e) => handleSearchProduct(e.target.value)}
                  suffix={
                    <SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  }
                  autoFocus
                />
              </Col>
            </Row>

            {/* Listado Carrito */}
            <ArticuloHeader />
            <List
              dataSource={carritoMemo}
              locale={{ emptyText: "El carrito está vacío." }}
              renderItem={(item) => (
                <List.Item style={{ padding: 0 }}>
                  <ArticuloItem
                    {...item}
                    onDelete={() => handleDeleteItem(item.id)}
                    onUpdate={handleUpdateItem}
                  />
                </List.Item>
              )}
              style={{
                minHeight: "300px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            />
          </Col>

          {/* Resumen Carrito */}
          <Col xs={24} lg={6}>
            <ResumenCarrito data={valuesResumentCarrito} />
          </Col>
        </Row>
      </div>

      {/* MODAL DE ARTÍCULOS */}
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
