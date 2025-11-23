import React, { useState, useMemo } from "react";
import { Row, Col, Input, List, Typography, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ArticuloItem from "./compoents/ArticuloItem";
import ResumenCarrito from "./compoents/ResumenCarrito";
import { mockProducts, productColumns } from "../../data/mockData";
import SelectSingleModal from "../../components/SelectSingleModal";

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

  const handleSearchProduct = (value) => {
    setSearchValue(value);
    setOpenProductModal(true);
  };

  const handleDeleteItem = () => {
    console.log("Borrar Producto ");
  };

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
            {/* Buscador de Código/Descripción */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col xs={24}>
                <Input
                  placeholder="Buscar Artículo (código de barras o descripción)"
                  size="large"
                  onPressEnter={(e) => handleSearchProduct(e.target.value)}
                  suffix={
                    <SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  }
                />
              </Col>
            </Row>

            {/* Titulos de la Lista */}
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
              <Col xs={24} md={2} style={{ textAlign: "center" }}></Col>
            </Row>

            {/* Cuerpo de la Lista */}
            <List
              dataSource={listCarrito}
              locale={{ emptyText: "El carrito está vacío." }}
              renderItem={(item) => (
                <List.Item style={{ padding: 0 }}>
                  <ArticuloItem
                    {...item}
                    handleDelete={() => handleDeleteItem(item.key)}
                  />
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

          {/* Resumen de Carrito */}
          <Col xs={24} lg={8}>
            {/* Se pasa el mock estático */}
            <ResumenCarrito data={valuesResumentCarrito} />
          </Col>
        </Row>
      </div>

      {/* Modal de Buscador  */}
      <SelectSingleModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        title="Seleccionar Artículo"
        width={700}
        data={mockProducts} // 🔥 tu lista de productos
        columns={productColumns} // 🔥 columnas de la tabla
        onSelect={() => {}}
      />
    </div>
  );
};

export default POS;
