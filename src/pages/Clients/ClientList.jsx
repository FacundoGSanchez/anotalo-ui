import { useState, useMemo, useCallback } from "react";
import { Table, Button, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { intitialListClient } from "./ClientData";
import getClientColumns from "./ClientColumns";

const ClientList = () => {
  const navigate = useNavigate();
  const [dataSource] = useState(intitialListClient);

  const handleEdit = useCallback((record) => {
    navigate(`/clientsDetail/${record.id}`);
  }, [navigate]);

  const handleDelete = useCallback((record) => {
    let inputValue = "";
    const modal = Modal.confirm({
      title: `¿Estás seguro que querés borrar "${record.denominacion}"?`,
      content: (
        <div>
          <p>Esta acción no se puede deshacer.</p>
          <p>
            Escribí <strong>CONFIRMAR</strong> para continuar:
          </p>
          <Input
            onChange={(e) => {
              inputValue = e.target.value;
              modal.update({
                okButtonProps: {
                  disabled: inputValue !== "CONFIRMAR",
                },
              });
            }}
            placeholder="Escribí CONFIRMAR"
          />
        </div>
      ),
      okText: "Borrar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        // Aquí iría la lógica real de borrado
        console.log("Cliente eliminado:", record.id);
      },
      okButtonProps: {
        disabled: true,
      },
    });
  }, []);

  const columns = useMemo(() => getClientColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }), [handleEdit, handleDelete]);

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <h1 className="client-list-title">Listado de Clientes</h1>
        <Button
          type="primary"
          className="client-list-button"
          onClick={() => navigate("/clientsDetail")}
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
