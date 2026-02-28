import React, { useState, useEffect } from "react";
import { Typography, Button } from "antd";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importamos el idioma

// Importación de sub-componentes
import ResumenCards from "./components/ResumenCards";
import AccesosDirectos from "./components/AccesosDirectos";
import GestionGrid from "./components/GestionGrid";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totales, setTotales] = useState({ ventas: 0, pagos: 0, retiros: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
    const hoy = dayjs().format("YYYY-MM-DD");
    const delDia = saved.filter((m) => m.fecha === hoy);

    setTotales({
      ventas: delDia
        .filter((m) => m.tipo === "Venta")
        .reduce((a, b) => a + b.importe, 0),
      pagos: delDia
        .filter((m) => m.tipo === "Pago")
        .reduce((a, b) => a + b.importe, 0),
      retiros: delDia
        .filter((m) => m.tipo === "Retiro")
        .reduce((a, b) => a + b.importe, 0),
    });
  }, []);

  const handleIrARegistro = (tipo) => {
    navigate("/pos/anotalo", {
      state: {
        tipoInicial: tipo, // Aquí viaja "Venta", "Pago" o "Retiro"
        skipFirstStep: true,
      },
    });
  };

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      {/* HEADER DINÁMICO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start", // Alineado arriba para que la leyenda no mueva el botón
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
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "4px", // Ajuste fino para centrar visualmente con el título
          }}
        >
          Movimientos <MdArrowForward />
        </Button>
      </div>

      <ResumenCards totales={totales} />

      <AccesosDirectos onSelectTipo={handleIrARegistro} />

      <GestionGrid />
    </div>
  );
};

export default DashboardPage;
