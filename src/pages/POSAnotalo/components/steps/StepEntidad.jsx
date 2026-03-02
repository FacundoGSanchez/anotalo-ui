import React, { useState, useEffect } from "react";
import {
  Input,
  List,
  Typography,
  Button,
  Alert,
  Modal,
  message,
  Divider,
} from "antd";
import {
  MdSearch,
  MdPerson,
  MdChevronRight,
  MdWarning,
  MdAdd,
  MdClose,
  MdPersonAddAlt1,
} from "react-icons/md";

import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";

const { Text, Title } = Typography;

const StepEntidad = ({ tipo, formaPago, onNext }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [entidades, setEntidades] = useState([]);

  const esVenta = tipo === MOVIMIENTO_TIPOS.VENTA;
  const esCtaCte = formaPago === "Cta Corriente";

  // 1. Keys en minúsculas como pediste
  const tablaDB = esVenta ? "db_clientes" : "db_proveedores";
  const activeColor = esVenta ? "#1890ff" : "#fa8c16";

  useEffect(() => {
    const cargarDatos = () => {
      const db = JSON.parse(localStorage.getItem(tablaDB)) || [];
      setEntidades(db.filter((item) => item.activo !== false));
    };
    cargarDatos();
  }, [tablaDB]);

  const handleCreateNew = (nombre) => {
    const db = JSON.parse(localStorage.getItem(tablaDB)) || [];
    const ultimoNro =
      db.length > 0 ? Math.max(...db.map((e) => parseInt(e.nro) || 0)) : 0;

    const nuevoItem = {
      id: Date.now(),
      nro: ultimoNro + 1,
      nombre: nombre.trim(),
      activo: true,
      fechaAlta: new Date().toISOString(),
    };

    const nuevaDB = [...db, nuevoItem];
    localStorage.setItem(tablaDB, JSON.stringify(nuevaDB));

    message.success(`${esVenta ? "Cliente" : "Proveedor"} guardado`);
    handleSelect(nuevoItem); // Guarda y vuelve automáticamente al flujo
  };

  const filtrados = entidades.filter((i) =>
    i.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleSelect = (item) => {
    setIsModalOpen(false);
    onNext(item);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* HEADER RESUMEN */}
      <div
        style={{
          display: "flex",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "20px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ width: "8px", backgroundColor: activeColor }} />
        <div style={{ padding: "16px" }}>
          <Text
            type="secondary"
            style={{ fontSize: "11px", fontWeight: "700", display: "block" }}
          >
            PASO 3: IDENTIFICACIÓN
          </Text>
          <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
            {esVenta ? "Seleccionar Cliente" : "Seleccionar Proveedor"}
          </Title>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* BUSCADOR PRINCIPAL */}
        <Button
          block
          size="large"
          icon={<MdSearch size={24} />}
          onClick={() => setIsModalOpen(true)}
          style={{
            height: "64px",
            borderRadius: "16px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            color: "#595959",
            border: `1px solid #d9d9d9`,
          }}
        >
          {esVenta ? "Buscar en Clientes..." : "Buscar en Proveedores..."}
        </Button>

        {/* 2. LÓGICA DE PREDETERMINADOS: Solo Clientes tiene Consumidor Final */}
        {esVenta && !esCtaCte && (
          <Button
            block
            size="large"
            type="dashed"
            icon={<MdPerson size={24} />}
            onClick={() => onNext({ id: 0, nombre: "Consumidor Final" })}
            style={{
              height: "64px",
              borderRadius: "16px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              borderColor: activeColor,
              color: activeColor,
            }}
          >
            Consumidor Final
          </Button>
        )}

        {/* 3. BOTÓN DISCRETO PARA NUEVO (Acceso directo) */}
        <Divider
          style={{ margin: "12px 0", fontSize: "12px", color: "#bfbfbf" }}
        >
          O BIEN
        </Divider>

        <Button
          type="text"
          icon={<MdPersonAddAlt1 size={20} />}
          onClick={() => setIsModalOpen(true)} // Abre el buscador para que ingrese el nombre
          style={{
            height: "40px",
            color: "#8c8c8c",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Dar de alta nuevo {esVenta ? "cliente" : "proveedor"}
        </Button>
      </div>

      {/* MODAL DE BÚSQUEDA Y ALTA */}
      <Modal
        title={null}
        footer={null}
        closeIcon={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
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
          <Button
            type="text"
            icon={<MdClose size={24} />}
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        <div style={{ height: "calc(100% - 80px)", overflowY: "auto" }}>
          {filtrados.length > 0 ? (
            <List
              dataSource={filtrados}
              renderItem={(item) => (
                <div
                  onClick={() => handleSelect(item)}
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
            busqueda.length > 2 && (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "20px" }}
                >
                  No existe "{busqueda}" en la base de datos.
                </Text>
                <Button
                  type="primary"
                  icon={<MdAdd />}
                  onClick={() => handleCreateNew(busqueda)}
                  style={{
                    height: "50px",
                    borderRadius: "12px",
                    backgroundColor: activeColor,
                    border: "none",
                    padding: "0 30px",
                  }}
                >
                  CREAR Y SELECCIONAR
                </Button>
              </div>
            )
          )}
        </div>
      </Modal>

      {/* ADVERTENCIA PROVEEDOR O CTA CTE */}
      {(!esVenta || esCtaCte) && (
        <div style={{ marginTop: "20px" }}>
          <Alert
            message="Identificación requerida"
            description={
              esCtaCte
                ? "Las cuentas corrientes requieren un titular."
                : "Para gastos o egresos debe identificar al proveedor."
            }
            type="info"
            showIcon
            icon={<MdWarning />}
            style={{ borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
};

export default StepEntidad;
