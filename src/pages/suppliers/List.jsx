import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
// 💡 Cambiada la importación de columnas
import getSupplierColumns from "./Columns";
// 💡 Cambiada la importación de data inicial
import { initialListSupplier } from "./Data";

const SupplierList = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  // 🔹 Inicializar localStorage con data inicial si no existe
  useEffect(() => {
    // 💡 Cambiado de 'clients' a 'suppliers'
    const suppliersLS = localStorage.getItem("suppliers");
    if (!suppliersLS) {
      // 💡 Cambiado de 'iniitalListClient' a 'initialListSupplier'
      localStorage.setItem("suppliers", JSON.stringify(initialListSupplier));
      setDataSource(initialListSupplier);
    } else {
      setDataSource(JSON.parse(suppliersLS));
    }
  }, []);

  // 🔹 Cada vez que cambia localStorage, actualizar listado
  useEffect(() => {
    const handleStorageChange = () => {
      // 💡 Cambiado de 'clients' a 'suppliers'
      const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
      setDataSource(suppliers);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleEdit = useCallback(
    (record) => {
      // 💡 Cambiada la ruta de navegación
      navigate(`/supplier/${record.id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        // 💡 Cambiado de 'Cliente' a 'Proveedor'
        title: `¿Estás seguro que querés borrar el proveedor "${record.denominacion}"?`,
        content: <p>Esta acción no se puede deshacer.</p>,
        okText: "Borrar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk() {
          const updated = dataSource.filter((item) => item.id !== record.id);
          setDataSource(updated);
          // 💡 Cambiado de 'clients' a 'suppliers'
          localStorage.setItem("suppliers", JSON.stringify(updated));
        },
      });
    },
    [dataSource]
  );

  const columns = useMemo(
    () =>
      // 💡 Cambiado de 'getClientColumns' a 'getSupplierColumns'
      getSupplierColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="supplier-list-container">
      <div className="supplier-list-header">
        {/* 💡 Cambiado de 'Clientes' a 'Proveedores' */}
        <h1 className="supplier-list-title">Listado de Proveedores</h1>
        <Button
          type="primary"
          className="supplier-list-button"
          // 💡 Cambiada la ruta de navegación
          onClick={() => navigate("/supplier")}
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

export default SupplierList;
