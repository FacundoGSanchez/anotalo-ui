import React from "react";
import { useParams } from "react-router-dom";
import EntidadesListado from "./components/EntidadesListado";
import EntidadDetalleContainer from "./components/EntidadDetalle/EntidadDetalleContainer";

const EntidadesPage = () => {
  const { tipo, action, id } = useParams();

  // Debug: Si esto sale undefined al hacer clic en una fila, el problema es el AppRouter
  console.log("Params en Orquestador:", { tipo, action, id });

  if (action === "nuevo" || action === "edit") {
    return <EntidadDetalleContainer />;
  }
  return <EntidadesListado />;
};

export default EntidadesPage;
