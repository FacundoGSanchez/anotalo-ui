import React, { useEffect, useState, useCallback } from "react";
import { Modal, Input, Table, List, Button } from "antd";
import { useDevice } from "../../context/DeviceContext";

const SelectSingleModal = ({
  open,
  onClose,
  data = [],
  columns = [], // columnas genéricas para desktop
  onSelect, // callback que devuelve el item seleccionado
  mobileFields = ["detalle", "codigo"],
  // campos a mostrar en mobile → por defecto usa "detalle" y "codigo"
}) => {
  const { isMobile } = useDevice();

  // Estado del filtro
  const [filter, setFilter] = useState("");

  // Lista filtrada
  const [filtered, setFiltered] = useState([]);

  // Índice actual del cursor para navegación con teclado
  const [cursor, setCursor] = useState(0);

  /* FILTRAR DATA */
  useEffect(() => {
    const f = filter.toLowerCase();

    const res = data.filter((item) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(f))
    );

    setFiltered(res);
    setCursor(0);
  }, [filter, data]);

  /* NAVEGACIÓN EN DESKTOP */
  useEffect(() => {
    if (!open || isMobile) return;

    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((p) => Math.min(p + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((p) => Math.max(p - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[cursor]) handleSelect(filtered[cursor]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, cursor, isMobile]);

  /* FUNCIÓN DE SELECCIÓN */
  const handleSelect = useCallback(
    (item) => {
      onSelect(item);
      onClose();
    },
    [onSelect, onClose]
  );

  return (
    <Modal
      title="Seleccionar"
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100%" : 700}
      style={isMobile ? { top: 0 } : {}}
    >
      {/* INPUT DE FILTRO */}
      <Input
        placeholder="Buscar..."
        autoFocus
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* DESKTOP → TABLA */}
      {!isMobile && (
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey={(row) => row.id || row.codigo || JSON.stringify(row)}
          pagination={false}
          size="small"
          scroll={{ y: 420 }}
          rowClassName={(_, idx) => (idx === cursor ? "row-selected" : "")}
          onRow={(record, idx) => ({
            onClick: () => setCursor(idx),
          })}
        />
      )}

      {/* MOBILE → LISTA SIMPLE CON BOTÓN */}
      {isMobile && (
        <List
          dataSource={filtered}
          style={{ maxHeight: 450, overflowY: "auto" }}
          renderItem={(item) => (
            <List.Item
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              {/* Render dinámico según campos pasados */}
              {mobileFields.map((field) => (
                <div
                  key={field}
                  style={{
                    fontSize: field === mobileFields[0] ? 16 : 12,
                    fontWeight: field === mobileFields[0] ? 500 : 400,
                    color: field === mobileFields[0] ? "#333" : "#777",
                  }}
                >
                  {item[field]}
                </div>
              ))}

              <Button
                type="primary"
                block
                style={{ marginTop: 8 }}
                onClick={() => handleSelect(item)}
              >
                Seleccionar
              </Button>
            </List.Item>
          )}
        />
      )}

      {/* ESTILO DE FILA SELECCIONADA DESKTOP */}
      <style>
        {`
        .row-selected {
          background: #e6f7ff !important;
        }
      `}
      </style>
    </Modal>
  );
};

export default SelectSingleModal;
