import { useState } from "react";
import { Table, Button, Space, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { intitialListClient } from "../data/ClientData";

const ClientList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState(intitialListClient);

  const showDeleteConfirm = (record) => {
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
        navigate(`/clientsDetail/${record.id}`);
      },
      okButtonProps: {
        disabled: true,
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            onClick={() => navigate(`/clientsDetail/${record.id}`)}
            className="action-icon-button"
          >
            <FaEdit size={32} color="#1890ff" />
          </Button>
          <Button
            type="text"
            danger
            onClick={() => showDeleteConfirm(record)}
            className="action-icon-button"
          >
            <FaTrashAlt size={32} color="#ff4d4f" />
          </Button>
        </Space>
      ),
    },
  ];

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
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default ClientList;
