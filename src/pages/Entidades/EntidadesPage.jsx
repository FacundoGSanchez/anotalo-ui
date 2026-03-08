import React from "react";
import { useParams } from "react-router-dom";
import EntidadesListado from "./components/EntidadesListado";
import EntidadDetalleContainer from "./components/EntidadDetalle/EntidadDetalleContainer";

const EntidadesPage = () => {
  const { tipo, action, id } = useParams();

  if (action === "nuevo" || action === "edit") {
    return <EntidadDetalleContainer />;
  }
  return <EntidadesListado />;
};

export default EntidadesPage;
