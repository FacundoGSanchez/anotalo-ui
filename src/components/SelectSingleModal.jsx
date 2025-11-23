// SelectSingleModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const SelectSingleModal = ({
  open,
  onClose,
  title = "Seleccionar",
  width = 400,
  data = [],
  columns = [],
  onSelect,
}) => {
  const [filter, setFilter] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredData = data.filter((item) =>
    Object.values(item).some((v) =>
      v?.toString()?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  useEffect(() => setHighlightedIndex(0), [filter, open]);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredData.length ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredData[highlightedIndex];
      if (item) onSelect(item);
    }
  };

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // ✔ Agregamos la columna del botón acá adentro
  const finalColumns = [
    ...columns,
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<CheckOutlined />}
          onClick={() => onSelect(record)}
          tabIndex={-1} // 🔥 evita que el botón tenga focus
          style={{ padding: "0 6px" }} // opcional, para que quede más compacto
        />
      ),
    },
  ];

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={width}
    >
      <Input
        placeholder="Buscar..."
        autoFocus
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 15 }}
      />

      <Table
        columns={finalColumns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false} // 🔥 paginado desactivado
        scroll={{ y: 240 }} // 🔥 altura reducida (50%)
        onRow={(record) => ({
          onDoubleClick: () => onSelect(record),
        })}
        rowClassName={(_, index) =>
          index === highlightedIndex ? "row-highlight" : ""
        }
      />

      <style>{`
        .row-highlight {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </Modal>
  );
};

export default SelectSingleModal;
