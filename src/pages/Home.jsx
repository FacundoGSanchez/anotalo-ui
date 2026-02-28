import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard/DashboardPage.jsx"; // El componente creado arriba
import dayjs from "dayjs";

const Home = () => {
  const [resumen, setResumen] = useState({
    totalVentas: 0,
    cantMovimientos: 0,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
    const hoy = dayjs().format("YYYY-MM-DD");

    const ventasHoy = saved.filter(
      (m) => m.fecha === hoy && m.tipo === "Venta",
    );
    const total = ventasHoy.reduce((acc, curr) => acc + curr.importe, 0);

    setResumen({
      totalVentas: total,
      cantMovimientos: saved.filter((m) => m.fecha === hoy).length,
    });
  }, []);

  return <Dashboard resumen={resumen} />;
};

export default Home;
