import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal, message, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import getItemColumns from "./Columns";
import { initialListItem } from "./Data";

const ItemList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(() => {
    const itemsLS = localStorage.getItem("items");

    if (!itemsLS || JSON.parse(itemsLS).length === 0) {
      localStorage.setItem("items", JSON.stringify(initialListItem));
      setDataSource(initialListItem);
    } else {
      setDataSource(JSON.parse(itemsLS));
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [loadData]);

  const handleEdit = useCallback(
    (record) => {
      navigate(`/item/${record.id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        title: `¿Estás seguro que querés borrar el item "${record.denominacion}"?`,
        content: <p>Esta acción no se puede deshacer.</p>,
        okText: "Borrar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk() {
          const updated = dataSource.filter((item) => item.id !== record.id);
          setDataSource(updated);
          localStorage.setItem("items", JSON.stringify(updated));
          message.success(`Item "${record.denominacion}" eliminado.`);
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
      (item) =>
        item.denominacion.toLowerCase().includes(lowercasedSearch) ||
        (item.codigo_barras &&
          String(item.codigo_barras).toLowerCase().includes(lowercasedSearch))
    );
  }, [dataSource, searchText]);

  const columns = useMemo(
    () =>
      getItemColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="item-list-container">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <h1 className="item-list-title" style={{ margin: 0 }}>
            Listado de Productos y Servicios
          </h1>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={24} lg={18}>
          <Input.Search
            placeholder="Buscar por descripción o código de barras"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>

        <Col xs={24} sm={24} lg={6} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            className="item-list-button"
            onClick={() => navigate("/item")}
            style={{ width: "100%", maxWidth: 180 }}
            size="large"
          >
            Nuevo Item
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 25 }}
        rowKey="id"
        className="compact-item-table"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ItemList;
