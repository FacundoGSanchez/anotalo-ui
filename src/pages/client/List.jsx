import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import getClientColumns from "./Columns";
import { iniitalListClient } from "./Data";

const ClientList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(() => {
    const clientsLS = localStorage.getItem("clients");
    if (!clientsLS || JSON.parse(clientsLS).length === 0) {
      localStorage.setItem("clients", JSON.stringify(iniitalListClient));
      setDataSource(iniitalListClient);
    } else {
      setDataSource(JSON.parse(clientsLS));
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleStorageChange = () => {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      setDataSource(clients);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadData]);

  const handleEdit = useCallback(
    (record) => {
      navigate(`/client/${record.id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        title: `¿Estás seguro que querés borrar "${record.denominacion}"?`,
        content: <p>Esta acción no se puede deshacer.</p>,
        okText: "Borrar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk() {
          const updated = dataSource.filter((item) => item.id !== record.id);
          setDataSource(updated);
          localStorage.setItem("clients", JSON.stringify(updated));
        },
      });
    },
    [dataSource]
  );

  // Lógica de filtrado simplificada: solo por denominación o teléfono
  const filteredData = useMemo(() => {
    if (!searchText) {
      return dataSource;
    }
    const lowercasedSearch = searchText.toLowerCase();

    return dataSource.filter(
      (client) =>
        client.denominacion.toLowerCase().includes(lowercasedSearch) ||
        (client.telefono &&
          client.telefono.toLowerCase().includes(lowercasedSearch))
    );
  }, [dataSource, searchText]);

  const columns = useMemo(
    () =>
      getClientColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="client-list-container">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <h1 className="client-list-title" style={{ margin: 0 }}>
            Listado de Clientes
          </h1>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={24} lg={18}>
          <Input.Search
            placeholder="Buscar por nombre o teléfono"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>

        <Col xs={24} sm={24} lg={6} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            className="client-list-button"
            onClick={() => navigate("/client")}
            style={{ width: "100%", maxWidth: 180 }}
            size="large"
          >
            Nuevo Cliente
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 20 }}
        rowKey="id"
      />
    </div>
  );
};

export default ClientList;
