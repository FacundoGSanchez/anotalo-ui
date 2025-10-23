import React, { useState, useMemo } from "react";
import { Row, Col, Input, List, Typography, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ArticuloItem from "./compoents/ArticuloItem";
import ResumenCarrito from "./compoents/ResumenCarrito";

const { Title } = Typography;

// ===============================================
// MOCKS ESTATICOS PARA EL RENDER
// ===============================================

// Datos de ejemplo para mostrar la lista
const MOCK_CARRITO_ESTATICO = [
  {
    key: "1",
    detalle: "Pantalon Algodon Verano | Talle 12",
    codigo: "X732049",
    precio: 1540.0,
    dif: 50.0,
    cant: 2,
    subtotal: 3180.0,
  },
  {
    key: "2",
    detalle: "Buzo Algodon Azul | Talle 12",
    codigo: "X881023",
    precio: 1540.0,
    dif: -100.0,
    cant: 1,
    subtotal: 1440.0,
  },
];

// Datos de ejemplo para la búsqueda (simulada)
const MOCK_MAESTRO_ESTATICO = [
  ...MOCK_CARRITO_ESTATICO,
  {
    key: "3",
    detalle: "Remera Algodon | Talle 10",
    codigo: "X945678",
    precio: 1540.0,
    dif: 0.0,
    cant: 1,
    subtotal: 1540.0,
  },
];

// Datos estáticos para el resumen
const MOCK_RESUMEN_ESTATICO = {
  itemsCount: 3,
  subtotal: "4.620,00", // (3180 + 1440)
  descuentos: "500,00",
  recargo: "100,00",
  total: "4.220,00", // (4620 + 100 - 500)
};

// ===============================================
// ESTILOS Y UTILIDADES
// ===============================================

const containerElevationStyle = {
  boxShadow:
    "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
  borderRadius: "8px",
  padding: "20px",
  backgroundColor: "#fff",
};

// Función de formato simplificada para el modal estático
const formatPrice = (num) => num.toFixed(2).replace(".", ",");

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

const POS = () => {
  // 🧹 Se inicializan estados con valores estáticos/vacíos
  const [carrito] = useState(MOCK_CARRITO_ESTATICO);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productosFiltrados] = useState(MOCK_MAESTRO_ESTATICO); // Usado solo para el modal estático

  // Función simulada para mostrar el modal de búsqueda (sin lógica de filtrado)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Simula abrir el modal si hay texto, para mostrar el mock de productos
    if (value.length >= 3) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  };

  // Funciones placeholder para evitar errores de referencia en el render
  const handleSearchProduct = () => {
    console.log("Buscar Producto");
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
                  value={searchTerm}
                  onChange={handleSearchChange}
                  // Se deja onPressEnter apuntando al placeholder
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
              dataSource={carrito}
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
            <ResumenCarrito data={MOCK_RESUMEN_ESTATICO} />
          </Col>
        </Row>
      </div>

      {/* MODAL DE BÚSQUEDA MANUAL */}
      <Modal
        title="Seleccionar Artículo (Simulado)"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={productosFiltrados}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              actions={[
                <a onClick={() => handleSelectProductFromModal(item)}>
                  Agregar (Simulado)
                </a>,
              ]}
            >
              <List.Item.Meta
                title={item.detalle}
                description={`Código: ${item.codigo} | Precio: $${formatPrice(
                  item.precio
                )}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default POS;
