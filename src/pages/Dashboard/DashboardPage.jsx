import { useState, useEffect, useCallback } from "react";
import { Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { movimientoService } from "../../services/movimientoService";
import ResumenCards from "./components/ResumenCards";
import AccesosDirectos from "./components/AccesosDirectos";
import AccesoReportes from "./components/AccesoReportes";
import GestionGrid from "./components/GestionGrid";

const { Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
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

  const handleIrARegistro = (tipo) => {
    navigate("/pos/anotalo", {
      state: {
        tipoDirecto: tipo,
        skipFirstStep: true,
      },
    });
  };

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      {/* RESUMEN + INDICADORES */}
      <Card
        style={{
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          marginBottom: "24px",
        }}
        styles={{ body: { padding: "16px 16px 12px" } }}
      >
        <Text
          type="secondary"
          style={{ display: "block", fontSize: "12px", textTransform: "capitalize", marginBottom: "12px" }}
        >
          {dayjs().locale("es").format("dddd, DD [de] MMMM")}
        </Text>

        <ResumenCards totales={totales} />
      </Card>

      {/* ACCESOS RÁPIDOS */}
      <section style={{ marginBottom: "24px" }}>
        <Text
          strong
          style={{
            display: "block",
            marginBottom: "12px",
            color: "#8c8c8c",
            fontSize: "12px",
          }}
        >
          ACCESOS RÁPIDOS
        </Text>
        <AccesosDirectos onSelectTipo={handleIrARegistro} />
      </section>

      {/* REPORTES */}
      <section style={{ marginBottom: "24px" }}>
        <Text
          strong
          style={{
            display: "block",
            marginBottom: "12px",
            color: "#8c8c8c",
            fontSize: "12px",
          }}
        >
          REPORTES
        </Text>
        <AccesoReportes />
      </section>

      {/* GESTIÓN */}
      <section>
        <Text
          strong
          style={{
            display: "block",
            marginBottom: "12px",
            color: "#8c8c8c",
            fontSize: "12px",
          }}
        >
          GESTIÓN
        </Text>
        <GestionGrid />
      </section>
    </div>
  );
};

export default DashboardPage;
