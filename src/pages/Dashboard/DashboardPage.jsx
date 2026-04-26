import React, { useState, useEffect, useCallback } from "react";
import { Typography, Button } from "antd";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { MOVIMIENTO_TIPOS } from "../../constants/posConstants";
import ResumenCards from "./components/ResumenCards";
import AccesosDirectos from "./components/AccesosDirectos";
import GestionGrid from "./components/GestionGrid";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totales, setTotales] = useState({
    ventas: 0,
    pagos: 0,
    retiros: 0,
    ingresos: 0,
  });

  /**
   * FUNCIÓN REUTILIZABLE: Obtiene y procesa los datos del día
   * La envolvemos en useCallback para evitar recreaciones innecesarias
   */
  const cargarResumenDelDia = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
      const hoy = dayjs().format("YYYY-MM-DD");

      // 1. Filtrado único por fecha (más eficiente)
      const movimientosDeHoy = saved.filter((m) => m.fecha === hoy);

      // 2. Reducción en un solo paso para evitar múltiples .filter().reduce()
      const calculo = movimientosDeHoy.reduce(
        (acc, mov) => {
          const importe = Number(mov.importe) || 0;

          switch (mov.tipo) {
            case MOVIMIENTO_TIPOS.VENTA:
              acc.ventas += importe;
              break;
            case MOVIMIENTO_TIPOS.PAGO:
              acc.pagos += importe;
              break;
            case MOVIMIENTO_TIPOS.RETIRO:
              acc.retiros += importe;
              break;
            case MOVIMIENTO_TIPOS.INGRESO:
              acc.ingresos += importe;
              break;
            default:
              break;
          }
          return acc;
        },
        { ventas: 0, pagos: 0, retiros: 0, ingresos: 0 },
      );

      setTotales(calculo);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    }
  }, []);

  // Efecto de montaje y suscripción a eventos
  useEffect(() => {
    cargarResumenDelDia();

    const handleUpdate = () => cargarResumenDelDia();

    window.addEventListener("storage", handleUpdate); // Otras pestañas
    window.addEventListener("local-db-update", handleUpdate); // Misma pestaña (desde el servicio)
    window.addEventListener("focus", handleUpdate); // Al volver a la App en móvil

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
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: "700" }}>
            Resumen de Hoy
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "13px", textTransform: "capitalize" }}
          >
            {dayjs().locale("es").format("dddd, DD [de] MMMM")}
          </Text>
        </div>
        <Button
          type="link"
          onClick={() => navigate("/movimientos")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            paddingRight: 0,
          }}
        >
          Consultar Todos <MdArrowForward size={16} />
        </Button>
      </div>

      {/* CARDS SECTION */}
      <section style={{ marginBottom: "24px" }}>
        <ResumenCards totales={totales} />
      </section>

      {/* ACTIONS SECTION */}
      <section style={{ marginBottom: "32px" }}>
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

      {/* GRID SECTION */}
      <section>
        <GestionGrid />
      </section>
    </div>
  );
};

export default DashboardPage;
