import React, { useState, useEffect } from "react";
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
  // 1. Agregamos 'ingresos' al estado inicial
  const [totales, setTotales] = useState({
    ventas: 0,
    pagos: 0,
    retiros: 0,
    ingresos: 0,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
    const hoy = dayjs().format("YYYY-MM-DD");

    // Filtramos movimientos de hoy
    const delDia = saved.filter((m) => m.fecha === hoy);

    // 2. Calculamos incluyendo el tipo INGRESO
    setTotales({
      ventas: delDia
        .filter((m) => m.tipo === MOVIMIENTO_TIPOS.VENTA)
        .reduce((a, b) => a + Number(b.importe), 0),
      pagos: delDia
        .filter((m) => m.tipo === MOVIMIENTO_TIPOS.PAGO)
        .reduce((a, b) => a + Number(b.importe), 0),
      retiros: delDia
        .filter((m) => m.tipo === MOVIMIENTO_TIPOS.RETIRO)
        .reduce((a, b) => a + Number(b.importe), 0),
      ingresos: delDia
        .filter((m) => m.tipo === MOVIMIENTO_TIPOS.INGRESO)
        .reduce((a, b) => a + Number(b.importe), 0), // <--- Faltaba esta línea
    });
  }, []);

  const handleIrARegistro = (tipo) => {
    navigate("/pos/anotalo", {
      state: {
        tipoDirecto: tipo, // Esto debe coincidir con el useEffect del hook
        skipFirstStep: true,
      },
    });
  };

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Resumen
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "12px", textTransform: "capitalize" }}
          >
            {dayjs().locale("es").format("dddd, DD [de] MMMM")}
          </Text>
        </div>
        <Button
          type="link"
          onClick={() => navigate("/movimientos")}
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          Movimientos <MdArrowForward />
        </Button>
      </div>

      {/* Ahora 'totales' lleva la propiedad ingresos */}
      <ResumenCards totales={totales} />

      <AccesosDirectos onSelectTipo={handleIrARegistro} />

      <GestionGrid />
    </div>
  );
};

export default DashboardPage;
