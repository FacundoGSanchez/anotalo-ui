import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { Row, Col, Input, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import ArticuloItem from "./ArticuloItem";
import ResumenCarrito from "./ArticuloResumenCarrito";
import ArticuloHeader from "./ArticuloHeader";
import SelectSingleModal from "../../components/SelectSingleModal";
import { mockProducts, productColumns } from "../../data/mockData";

import { POSService } from "../../services/pos/_index";

import "./pos.css";

const { Title } = Typography;

const POS = () => {
  const searchInputRef = useRef(null);

  const [listCarrito, setListCarrito] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [valuesResumentCarrito, setValuesResumentCarrito] = useState({
    itemsCount: 0,
    subtotal: 0,
    descuentos: 0,
    recargo: 0,
    total: 0,
  });
  const [openProductModal, setOpenProductModal] = useState(false);

  // 🔹 Carga inicial (igual que antes)
  useEffect(() => {
    const saved = POSService.loadCarrito();
    setListCarrito(saved);
  }, []);

  // 🔹 Recalcular resumen (igual que antes)
  useEffect(() => {
    setValuesResumentCarrito(POSService.getResumen(listCarrito));
  }, [listCarrito]);

  const resetSearch = () => {
    setSearchText("");
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const handleSearchProduct = () => {
    setTimeout(() => {
      setOpenProductModal(true);
    }, 50);
  };

  const handleSelectProduct = (articulo) => {
    setListCarrito((prev) => POSService.addItem(prev, articulo));
    resetSearch(); // 🔥 limpiar POS
  };

  const handleDeleteItem = useCallback(
    (id) => setListCarrito((prev) => POSService.removeItem(prev, id)),
    []
  );

  const handleUpdateItem = (id, updatedValues) => {
    setListCarrito((prev) => POSService.updateItem(prev, id, updatedValues));
  };

  const handleCloseModal = () => {
    setOpenProductModal(false);
    resetSearch(); // 🔥 limpiar POS
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
                  ref={searchInputRef}
                  placeholder="Buscar Artículo (código de barras o descripción)"
                  size="large"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearchProduct}
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
        onClose={handleCloseModal}
        data={mockProducts}
        columns={productColumns}
        onSelect={handleSelectProduct}
        initialSearch={searchText}
      />
    </div>
  );
};

export default POS;
