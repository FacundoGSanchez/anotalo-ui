import React, { useState, useEffect } from "react";
import { Table, Tag, Card, Empty, Typography, Space } from "antd";
import { MdChevronRight } from "react-icons/md";
import dayjs from "dayjs";

// Componentes refactorizados
import HeaderMovimientos from "./components/HeaderMovimientos";
import ModalFiltros from "./components/ModalFiltros";
import ModalDetalleMovimiento from "./components/ModalDetalleMovimiento";

const { Text } = Typography;

const MovimientosPage = () => {
  const [movimientosOriginales, setMovimientosOriginales] = useState([]);
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);

  // Estados de Filtro
  const [fecha, setFecha] = useState(dayjs());
  const [tipos, setTipos] = useState(["Venta", "Pago", "Retiro"]);
  const [formas, setFormas] = useState([
    "Efectivo",
    "Debito",
    "Credito",
    "Transferencia",
    "Cta Corriente",
    "QR",
  ]);

  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);

  const cargarDatos = () => {
    const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
    setMovimientosOriginales(saved.sort((a, b) => b.id - a.id));
  };

  const limpiarFiltros = () => {
    setFecha(dayjs());
    setTipos(["Venta", "Pago", "Retiro"]);
    setFormas([
      "Efectivo",
      "Debito",
      "Credito",
      "Transferencia",
      "Cta Corriente",
      "QR",
    ]);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    let res = movimientosOriginales.filter((m) =>
      dayjs(m.fecha).isSame(fecha, "day"),
    );
    res = res.filter(
      (m) => tipos.includes(m.tipo) && formas.includes(m.formaPago),
    );
    setMovimientosFiltrados(res);
  }, [tipos, formas, fecha, movimientosOriginales]);

  const columns = [
    {
      title: "MOV",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Space size={6} style={{ marginBottom: 2 }}>
              <Tag color={record.tipo === "Venta" ? "blue" : "volcano"}>
                {record.tipo.toUpperCase()}
              </Tag>
              <Text type="secondary" style={{ fontSize: "11px" }}>
                {record.hora} • {record.formaPago}
              </Text>
            </Space>
            <Text strong style={{ display: "block" }}>
              {record.entidad?.nombre || "General"}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text
              strong
              style={{ color: record.tipo === "Venta" ? "#52c41a" : "#ff4d4f" }}
            >
              $ {record.importe.toLocaleString("es-AR")}
            </Text>
            <MdChevronRight size={18} color="#bfbfbf" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px", background: "#f8f9fa", minHeight: "100vh" }}>
      <HeaderMovimientos
        fecha={fecha}
        onOpenFiltros={() => setIsFiltroOpen(true)}
      />

      <Card
        styles={{ body: { padding: 0 } }}
        style={{ borderRadius: "12px", overflow: "hidden", border: "none" }}
      >
        <Table
          dataSource={movimientosFiltrados}
          columns={columns}
          showHeader={false}
          pagination={false}
          onRow={(record) => ({
            onClick: () => {
              setSelectedMov(record);
              setIsDetalleOpen(true);
            },
          })}
          locale={{ emptyText: <Empty description="Sin movimientos" /> }}
        />
      </Card>

      <ModalFiltros
        open={isFiltroOpen}
        onClose={() => setIsFiltroOpen(false)}
        tipos={tipos}
        setTipos={setTipos}
        formas={formas}
        setFormas={setFormas}
        fecha={fecha}
        setFecha={setFecha}
        onReset={limpiarFiltros} // <-- Pasamos la función
      />

      <ModalDetalleMovimiento
        visible={isDetalleOpen}
        movimiento={selectedMov}
        onClose={() => setIsDetalleOpen(false)}
        onUpdateList={cargarDatos}
      />
    </div>
  );
};

export default MovimientosPage;
