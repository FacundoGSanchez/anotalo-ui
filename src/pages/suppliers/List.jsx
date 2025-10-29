import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import getSupplierColumns from "./Columns";
import { initialListSupplier } from "./Data";

const SupplierList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(() => {
    const suppliersLS = localStorage.getItem("suppliers");
    if (!suppliersLS) {
      localStorage.setItem("suppliers", JSON.stringify(initialListSupplier));
      setDataSource(initialListSupplier);
    } else {
      setDataSource(JSON.parse(suppliersLS));
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleStorageChange = () => {
      const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
      setDataSource(suppliers);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadData]);

  const handleEdit = useCallback(
    (record) => {
      navigate(`/supplier/${record.id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        title: `¿Estás seguro que querés borrar el proveedor "${record.denominacion}"?`,
        content: <p>Esta acción no se puede deshacer.</p>,
        okText: "Borrar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk() {
          const updated = dataSource.filter((item) => item.id !== record.id);
          setDataSource(updated);
          localStorage.setItem("suppliers", JSON.stringify(updated));
        },
      });
    },
    [dataSource]
  );

  const filteredData = useMemo(() => {
    if (!searchText) {
      return dataSource;
    }
    const lowercasedSearch = searchText.toLowerCase();

    return dataSource.filter(
      (supplier) =>
        supplier.denominacion.toLowerCase().includes(lowercasedSearch) ||
        supplier.cuit.toLowerCase().includes(lowercasedSearch)
    );
  }, [dataSource, searchText]);

  const columns = useMemo(
    () =>
      getSupplierColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="supplier-list-container">
      {/* Fila 1: Título */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <h1 className="supplier-list-title" style={{ margin: 0 }}>
            Listado de Proveedores
          </h1>
        </Col>
      </Row>

      {/* Fila 2: Buscador y Botón (usando breakpoints simplificados) */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        {/* Buscador (Izquierda) */}
        <Col xs={24} sm={24} lg={18}>
          <Input.Search
            placeholder="Buscar por denominación"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>

        {/* Botón (Derecha) */}
        <Col xs={24} sm={24} lg={6} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            className="supplier-list-button"
            onClick={() => navigate("/supplier")}
            style={{ width: "100%", maxWidth: 180 }}
            size="large"
          >
            Nuevo Proveedor
          </Button>
        </Col>
      </Row>

      {/* Tabla de Proveedores */}
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 20 }}
        rowKey="id"
      />
    </div>
  );
};

export default SupplierList;
