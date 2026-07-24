import { useEffect, useRef, useState } from "react";
import { Modal, Input, Table } from "antd";
import type { TableColumnsType } from "antd";

interface SelectableItem {
  codigo: string;
  detalle: string;
  [key: string]: unknown;
}

interface SelectSingleModalProps<T extends SelectableItem> {
  open: boolean;
  onClose: () => void;
  onSelect: (record: T) => void;
  data?: T[];
}

function SelectSingleModal<T extends SelectableItem>({
  open,
  onClose,
  onSelect,
  data = [],
}: SelectSingleModalProps<T>) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<T[]>(data);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef<React.ComponentRef<typeof Input>>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  /* ------------------------------
     FOCUS AUTOMÁTICO AL ABRIR
  ------------------------------ */
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const el = searchRef.current as unknown as HTMLInputElement | null;
        el?.focus();
      }, 100);
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        (searchRef.current as unknown as HTMLInputElement | null)?.focus();
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
      rowRefs.current[activeIndex]!.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /* ------------------------------
     SELECCIONAR + CERRAR MODAL
  ------------------------------ */
  const handleSelect = (record: T) => {
    onSelect(record);
    onClose();
  };

  /* ------------------------------
     COLUMNAS TABLA
  ------------------------------ */
  const columns: TableColumnsType<T> = [
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
      style={{ top: 25 }}
    >
      <Input
        placeholder="Buscar por código o detalle…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={searchRef as any}
        autoComplete="off"
      />

      <Table<T>
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
          ref: (el: HTMLTableRowElement | null) => {
            rowRefs.current[index!] = el;
          },
          onClick: () => handleSelect(record),
        })}
      />
    </Modal>
  );
}

export default SelectSingleModal;
