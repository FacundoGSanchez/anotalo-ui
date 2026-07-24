import { useState, useEffect, useMemo } from "react";
import { Empty, Button } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";

import {
  MOVIMIENTO_TIPOS,
  NOMBRES_FORMAS_PAGO,
} from "../../../constants/posConstants";
import { movimientoService } from "../../../services/movimientoService";
import { useCurrentSucursal } from "../../../hooks/useCurrentSucursal";

import HeaderMovimientos from "./components/HeaderMovimientos";
import ModalFiltros from "./components/ModalFiltros";
import ModalDetalleMovimiento from "./components/ModalDetalleMovimiento";
import MovimientoGrupo from "./components/MovimientoGrupo";
import type { Movimiento } from "@/types";

interface GrupoData {
  items: Movimiento[];
  subtotal: number;
}

const MovimientosPage = () => {
  const [originales, setOriginales] = useState<Movimiento[]>([]);
  const [limit, setLimit] = useState(50);
  const [loadingMore, setLoadingMore] = useState(false);

  const [tipos, setTipos] = useState<string[]>(Object.values(MOVIMIENTO_TIPOS));
  const [formas, setFormas] = useState<string[]>(NOMBRES_FORMAS_PAGO);

  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState<Movimiento | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const { sucursalId } = useCurrentSucursal();

  useEffect(() => {
    cargarDatosDesdeStorage();
  }, []);

  const cargarDatosDesdeStorage = () => {
    const saved = movimientoService.getAll();
    setOriginales(saved.sort((a, b) => b.id - a.id));
  };

  const { agrupados, totalVisible } = useMemo(() => {
    const deSucursal = sucursalId
      ? originales.filter((m) => m.sucursalId === sucursalId)
      : originales;

    const fechaLimite = dayjs().subtract(7, "day").startOf("day");

    const filtrados = deSucursal.filter(
      (m) => {
        if (!tipos.includes(m.tipo)) return false;
        const pagaCon = m.formaPagos && m.formaPagos.length > 0
          ? m.formaPagos.some((fp) => formas.includes(fp.nombre || fp.key || ""))
          : formas.includes(m.formaPago || "");
        if (!pagaCon) return false;
        const { fecha } = movimientoService.extraerFechaHora(m.fechaRegistro);
        return dayjs(fecha).isAfter(fechaLimite.subtract(1, "day"));
      },
    );

    const segmentados = filtrados.slice(0, limit);

    const grupos: Record<string, GrupoData> = {};
    segmentados.forEach((item) => {
      const { fecha } = movimientoService.extraerFechaHora(item.fechaRegistro);
      let label = dayjs(fecha).locale("es").format("dddd DD [de] MMMM");
      if (dayjs(fecha).isSame(dayjs(), "day")) label = "Hoy";
      if (dayjs(fecha).isSame(dayjs().subtract(1, "day"), "day"))
        label = "Ayer";

      const labelFinal = label.charAt(0).toUpperCase() + label.slice(1);
      if (!grupos[labelFinal]) {
        grupos[labelFinal] = { items: [], subtotal: 0 };
      }
      grupos[labelFinal].items.push(item);
      grupos[labelFinal].subtotal += Number(item.importe) || 0;
    });

    return { agrupados: grupos, totalVisible: filtrados.length };
  }, [originales, tipos, formas, limit, sucursalId]);

  const handleCargarMas = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLimit((prev) => prev + 50);
      setLoadingMore(false);
    }, 600);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "16px",
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
