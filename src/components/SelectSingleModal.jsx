import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Table } from "antd";

const SelectSingleModal = ({ open, onClose, onSelect, data = [] }) => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(data);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const rowRefs = useRef({});

  /* ------------------------------
     FOCUS AUTOMÁTICO AL ABRIR
  ------------------------------ */
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 100);
      setActiveIndex(-1);
    }
  }, [open]);

  /* ------------------------------
     FILTRAR
  ------------------------------ */
  useEffect(() => {
    const f = data.filter(
      (x) =>
        x.detalle.toLowerCase().includes(search.toLowerCase()) ||
        x.codigo.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
    setActiveIndex(-1);
  }, [search, data]);

  /* ------------------------------
     NAVEGACIÓN POR TECLADO
  ------------------------------ */
  const handleKeyDown = (e) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      if (activeIndex === -1) {
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : prev
        );
      }
      e.preventDefault();
    }

    if (e.key === "ArrowUp") {
      if (activeIndex === 0) {
        setActiveIndex(-1);
        searchRef.current?.focus();
      } else if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
      e.preventDefault();
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(filtered[activeIndex]);
      e.preventDefault();
    }
  };

  /* ------------------------------
     SCROLL AUTOMÁTICO
  ------------------------------ */
  useEffect(() => {
    if (activeIndex >= 0 && rowRefs.current[activeIndex]) {
      rowRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /* ------------------------------
     SELECCIONAR + CERRAR MODAL
  ------------------------------ */
  const handleSelect = (record) => {
    onSelect(record);
    onClose(); // 🔥 cerrar el modal automáticamente
  };

  /* ------------------------------
     COLUMNAS TABLA
  ------------------------------ */
  const columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      width: 120,
    },
    {
      title: "Detalle",
      dataIndex: "detalle",
    },
  ];

  return (
    <Modal
      open={open}
      title="Seleccionar artículo"
      onCancel={onClose}
      footer={null}
      width={650}
      style={{ top: 25 }} // 🔥 modal más arriba
    >
      <Input
        placeholder="Buscar por código o detalle…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={searchRef}
        autoComplete="off"
      />

      <Table
        style={{ marginTop: 12 }}
        dataSource={filtered}
        columns={columns}
        pagination={false}
        rowKey="codigo"
        scroll={{ y: 350 }}
        rowClassName={(_, index) =>
          index === activeIndex ? "ant-table-row-selected" : ""
        }
        onRow={(record, index) => ({
          ref: (el) => (rowRefs.current[index] = el),
          onClick: () => handleSelect(record),
        })}
      />
    </Modal>
  );
};

export default SelectSingleModal;
