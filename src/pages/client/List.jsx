import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import getClientColumns from "./Columns";
import { iniitalListClient } from "./Data";

const ClientList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // 🔹 Inicializar localStorage con data inicial si no existe
  useEffect(() => {
    const clientsLS = localStorage.getItem("clients");
    if (!clientsLS) {
      localStorage.setItem("clients", JSON.stringify(iniitalListClient));
      setDataSource(iniitalListClient);
    } else {
      setDataSource(JSON.parse(clientsLS));
    }
  }, []);

  // 🔹 Cada vez que cambia localStorage, actualizar listado
  useEffect(() => {
    const handleStorageChange = () => {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      setDataSource(clients);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
      <div className="client-list-header">
        <h1 className="client-list-title">Listado de Clientes</h1>
        <Button
          type="primary"
          className="client-list-button"
          onClick={() => navigate("/client")}
        >
          Nuevo
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};

export default ClientList;
