import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, Input, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import ArticuloItem from "./compoents/ArticuloItem";
import ResumenCarrito from "./compoents/ResumenCarrito";

import { mockProducts, productColumns } from "../../data/mockData";
import SelectSingleModal from "../../components/SelectSingleModal/SelectSingleModal";

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
  const [valuesResumentCarrito, setValuesResumentCarrito] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  /* ---------------------------------------------
      ABRIR MODAL AL PRESIONAR ENTER EN EL INPUT
  ---------------------------------------------- */
  const handleSearchProduct = (value) => {
    setSearchValue(value);
    setTimeout(() => {
      setOpenProductModal(true);
    }, 50);
  };

  /* ---------------------------------------------
      AGREGAR ARTÍCULO SELECCIONADO AL CARRITO
  ---------------------------------------------- */
  const handleSelectProduct = (articulo) => {
    setListCarrito((prev) => [
      ...prev,
      {
        key: articulo.id,
        detalle: articulo.detalle,
        precio: articulo.precio,
        cantidad: 1,
        subtotal: articulo.precio,
        ...articulo,
      },
    ]);

    // acá podés recalcular resumen si corresponde
  };

  /* ---------------------------------------------
      ELIMINAR ITEM DEL CARRITO
  ---------------------------------------------- */
  const handleDeleteItem = useCallback((key) => {
    setListCarrito((prev) => prev.filter((item) => item.key !== key));
  }, []);

  /* ---------------------------------------------
      OPTIMIZAR LISTA DEL CARRITO
  ---------------------------------------------- */
  const carritoMemo = useMemo(() => listCarrito, [listCarrito]);

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div style={containerElevationStyle}>
        <Title level={3} style={{ textAlign: "left", marginBottom: "24px" }}>
          Registrar Artículos
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Buscador */}
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

            {/* Encabezado de columnas */}
            <Row
              gutter={[8, 8]}
              style={{
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
                padding: "8px 0",
                borderBottom: "1px solid #e8e8e8",
                marginBottom: "8px",
              }}
            >
              <Col xs={24} md={8}>
                Detalle
              </Col>
              <Col xs={6} md={4} style={{ textAlign: "right" }}>
                Precio
              </Col>
              <Col xs={6} md={4} style={{ textAlign: "right" }}>
                Dif
              </Col>
              <Col xs={6} md={3} style={{ textAlign: "center" }}>
                Cant
              </Col>
              <Col xs={6} md={3} style={{ textAlign: "right" }}>
                Subtotal
              </Col>
              <Col xs={24} md={2}></Col>
            </Row>

            {/* Lista optimizada */}
            <List
              temLayout="horizontal"
              dataSource={carritoMemo}
              locale={{ emptyText: "El carrito está vacío." }}
              renderItem={(item) => (
                <List.Item style={{ padding: 0 }}>
                  <ArticuloItem {...item} handleDelete={handleDeleteItem} />
                </List.Item>
              )}
              bordered={false}
              style={{
                minHeight: "300px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            />
          </Col>

          {/* Resumen lateral */}
          <Col xs={24} lg={8}>
            <ResumenCarrito data={valuesResumentCarrito} />
          </Col>
        </Row>
      </div>

      {/* ---------------------------------------------
          MODAL GENÉRICO PARA SELECCIÓN DE ARTÍCULOS
      ---------------------------------------------- */}
      <SelectSingleModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        data={mockProducts}
        columns={productColumns}
        mobileFields={["detalle", "codigoProducto"]}
        onSelect={handleSelectProduct}
      />
    </div>
  );
};

export default POS;
