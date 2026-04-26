import React, { useState, useEffect } from "react";
import { Modal, Input, Button, List, Typography } from "antd";
import { MdSearch, MdClose, MdPerson, MdChevronRight } from "react-icons/md";

const { Text } = Typography;

const SelectorEntidadModal = ({
  open,
  onCancel,
  onSelect,
  tipo,
  tablaDB,
  activeColor,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [entidades, setEntidades] = useState([]);

  const esVenta = tipo === "Venta";

  useEffect(() => {
    if (open) {
      const cargarDatos = () => {
        const db = JSON.parse(localStorage.getItem(tablaDB)) || [];
        setEntidades(db.filter((item) => item.activo !== false));
      };
      cargarDatos();
      setBusqueda(""); // Resetear búsqueda al abrir
    }
  }, [open, tablaDB]);

  const filtrados = entidades.filter((i) =>
    i.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <Modal
      title={null}
      footer={null}
      closeIcon={null}
      open={open}
      onCancel={onCancel}
      centered
      styles={{ body: { padding: "12px", height: "70vh" } }}
      width="95%"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <Input
          autoFocus
          placeholder="Escribí el nombre..."
          prefix={<MdSearch size={22} style={{ color: activeColor }} />}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ height: "54px", borderRadius: "12px", fontSize: "16px" }}
        />
        <Button type="text" icon={<MdClose size={24} />} onClick={onCancel} />
      </div>

      <div style={{ height: "calc(100% - 80px)", overflowY: "auto" }}>
        {filtrados.length > 0 ? (
          <List
            dataSource={filtrados}
            renderItem={(item) => (
              <div
                onClick={() => onSelect(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "18px 14px",
                  borderBottom: "1px solid #f5f5f5",
                  cursor: "pointer",
                }}
              >
                <MdPerson
                  size={22}
                  style={{ marginRight: "12px", color: "#d9d9d9" }}
                />
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: "block", fontSize: "15px" }}>
                    {item.nombre}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    Nro: {item.nro}
                  </Text>
                </div>
                <MdChevronRight size={22} style={{ color: "#d9d9d9" }} />
              </div>
            )}
          />
        ) : (
          busqueda.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Text type="secondary">No se encontraron resultados.</Text>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

export default SelectorEntidadModal;
