import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import getItemColumns from "./Columns"; // 💡 Nueva importación
import { initialListItem } from "./Data"; // 💡 Nueva importación

const ItemList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // 💡 Referencia al localStorage ahora es 'items'
  useEffect(() => {
    const itemsLS = localStorage.getItem("items");
    if (!itemsLS) {
      localStorage.setItem("items", JSON.stringify(initialListItem));
      setDataSource(initialListItem);
    } else {
      setDataSource(JSON.parse(itemsLS));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const items = JSON.parse(localStorage.getItem("items") || "[]");
      setDataSource(items);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleEdit = useCallback(
    (record) => {
      // 💡 Ruta de navegación adaptada a '/item/:id'
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
          localStorage.setItem("items", JSON.stringify(updated)); // 💡 Referencia 'items'
          message.success(`Item "${record.denominacion}" eliminado.`);
        },
      });
    },
    [dataSource]
  );

  const columns = useMemo(
    () =>
      // 💡 Llamada a la nueva función de columnas
      getItemColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="item-list-container">
      {" "}
      {/* 💡 Nueva clase CSS */}
      <div className="item-list-header">
        {" "}
        {/* 💡 Nueva clase CSS */}
        <h1 className="item-list-title">
          Catálogo de Productos y Servicios
        </h1>{" "}
        {/* 💡 Título adaptado */}
        <Button
          type="primary"
          className="item-list-button"
          onClick={() => navigate("/item")} // 💡 Ruta de navegación adaptada a '/item'
        >
          Nuevo Item
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />
    </div>
  );
};

export default ItemList;
