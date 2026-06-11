import { useState, useEffect, useCallback } from "react";
import { Card } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { movimientoService } from "../../services/movimientoService";
import { useDevice } from "../../context/DeviceContext";
import ResumenCards from "./components/ResumenCards";
import AccesoReportes from "./components/AccesoReportes";
import AccesoReportesNuevo from "./components/AccesoReportesNuevo";

const DashboardPage = () => {
  const { isMobile } = useDevice();
  const [totales, setTotales] = useState({});

  const cargarResumenDelDia = useCallback(() => {
    try {
      const saved = movimientoService.getAll();
      const hoy = dayjs().format("YYYY-MM-DD");
      const movimientosDeHoy = saved.filter((m) => m.fecha === hoy);

      const calculo = movimientosDeHoy.reduce(
        (acc, mov) => {
          const importe = Number(mov.importe) || 0;
          const tipo = mov.tipo;
          acc[tipo] = (acc[tipo] || 0) + importe;
          return acc;
        },
        {},
      );

      setTotales(calculo);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    }
  }, []);

  useEffect(() => {
    cargarResumenDelDia();
    const handleUpdate = () => cargarResumenDelDia();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("local-db-update", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("local-db-update", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [cargarResumenDelDia]);

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={isMobile ? {} : { maxWidth: "50%", margin: "0 auto" }}>
        {/* RESUMEN + INDICADORES */}
        <Card
          style={{
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
            marginBottom: "16px",
          }}
          styles={{ body: { padding: "16px 16px 12px" } }}
        >
          <ResumenCards totales={totales} />
        </Card>

        {/* GESTIONES */}
        <div style={{ marginBottom: "16px" }}>
          <AccesoReportes />
        </div>

        {/* REPORTES */}
        <div style={{ marginBottom: "16px" }}>
          <AccesoReportesNuevo />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
