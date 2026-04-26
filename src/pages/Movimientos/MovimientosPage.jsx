import React, { useState, useEffect, useMemo } from "react";
import { Empty, Button, Spin } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Constantes
import {
  MOVIMIENTO_TIPOS,
  NOMBRES_FORMAS_PAGO,
} from "../../constants/posConstants";

// Sub-componentes
import HeaderMovimientos from "./components/HeaderMovimientos";
import ModalFiltros from "./components/ModalFiltros";
import ModalDetalleMovimiento from "./components/ModalDetalleMovimiento";
import MovimientoGrupo from "./components/MovimientoGrupo";

const MovimientosPage = () => {
  const [originales, setOriginales] = useState([]);
  const [limit, setLimit] = useState(50); // Control de paginación local
  const [loadingMore, setLoadingMore] = useState(false);

  // Filtros
  const [tipos, setTipos] = useState(Object.values(MOVIMIENTO_TIPOS));
  const [formas, setFormas] = useState(NOMBRES_FORMAS_PAGO);

  // UI States
  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);

  useEffect(() => {
    cargarDatosDesdeStorage();
  }, []);

  const cargarDatosDesdeStorage = () => {
    const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
    // Ordenar por ID/Fecha descendente
    setOriginales(saved.sort((a, b) => b.id - a.id));
  };

  // --- LÓGICA DE FILTRADO Y AGRUPACIÓN ---
  const { agrupados, totalVisible } = useMemo(() => {
    // 1. Filtrar por Tipo, Forma de Pago y Límite de 7 días
    const fechaLimite = dayjs().subtract(7, "day").startOf("day");

    const filtrados = originales.filter(
      (m) =>
        tipos.includes(m.tipo) &&
        formas.includes(m.formaPago) &&
        dayjs(m.fecha).isAfter(fechaLimite.subtract(1, "day")),
    );

    // 2. Aplicar límite (Paginación)
    const segmentados = filtrados.slice(0, limit);

    // 3. Agrupar por fecha
    const grupos = {};
    segmentados.forEach((item) => {
      let label = dayjs(item.fecha).locale("es").format("dddd DD [de] MMMM");
      if (dayjs(item.fecha).isSame(dayjs(), "day")) label = "Hoy";
      if (dayjs(item.fecha).isSame(dayjs().subtract(1, "day"), "day"))
        label = "Ayer";

      const labelFinal = label.charAt(0).toUpperCase() + label.slice(1);
      if (!grupos[labelFinal]) {
        grupos[labelFinal] = { items: [], subtotal: 0 };
      }
      grupos[labelFinal].items.push(item);
      grupos[labelFinal].subtotal += Number(item.importe) || 0;
    });

    return { agrupados: grupos, totalVisible: filtrados.length };
  }, [originales, tipos, formas, limit]);

  const handleCargarMas = () => {
    setLoadingMore(true);
    // Simulamos un delay de red para cuando conectes la API
    setTimeout(() => {
      setLimit((prev) => prev + 50);
      setLoadingMore(false);
      // Aquí iría: fetchMoreFromAPI().then(...)
    }, 600);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <HeaderMovimientos onOpenFiltros={() => setIsFiltroOpen(true)} />

      {Object.keys(agrupados).length === 0 ? (
        <Empty style={{ marginTop: 80 }} description="Sin movimientos" />
      ) : (
        <>
          {Object.entries(agrupados).map(([fecha, data]) => (
            <MovimientoGrupo
              key={fecha}
              fecha={fecha}
              items={data.items}
              subtotal={data.subtotal}
              showSubtotal={tipos.length === 1}
              onSelect={(mov) => {
                setSelectedMov(mov);
                setIsDetalleOpen(true);
              }}
            />
          ))}

          {/* BOTÓN VER MÁS: Solo se muestra si hay más movimientos que el límite actual */}
          {totalVisible > limit && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                onClick={handleCargarMas}
                loading={loadingMore}
                style={{
                  borderRadius: "8px",
                  height: "40px",
                  width: "100%",
                  maxWidth: "300px",
                  fontWeight: 600,
                  color: "#1890ff",
                  border: "1px solid #1890ff",
                }}
              >
                {loadingMore ? "Cargando..." : "Ver más movimientos"}
              </Button>
            </div>
          )}
        </>
      )}

      <ModalFiltros
        open={isFiltroOpen}
        onClose={() => setIsFiltroOpen(false)}
        tipos={tipos}
        setTipos={setTipos}
        formas={formas}
        setFormas={setFormas}
        onReset={() => {
          setTipos(Object.values(MOVIMIENTO_TIPOS));
          setFormas(NOMBRES_FORMAS_PAGO);
        }}
      />

      <ModalDetalleMovimiento
        visible={isDetalleOpen}
        movimiento={selectedMov}
        onClose={() => setIsDetalleOpen(false)}
        onUpdateList={cargarDatosDesdeStorage}
      />
    </div>
  );
};

export default MovimientosPage;
