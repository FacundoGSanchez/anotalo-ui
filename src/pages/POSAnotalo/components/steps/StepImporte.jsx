import React, { useState } from "react";
import { Button, Typography } from "antd";
import { MdChevronRight } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import Calculadora from "./Calculadora";

const { Title, Text } = Typography;

const StepImporte = ({ tipo, onNext }) => {
  const [importe, setImporte] = useState(0);

  // 1. Uso de colores centralizado (Usa 'tipo' que viene por props)
  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  // Lógica de tamaño de fuente basada en las constantes de utils
  const getFontSize = () => {
    const largo = importe.toLocaleString("es-AR").length;
    if (largo > 9) return VISOR_CONFIG.SIZES.SMALL;
    if (largo > 7) return VISOR_CONFIG.SIZES.MEDIUM;
    return VISOR_CONFIG.SIZES.DEFAULT;
  };

  const handlePress = (val) => {
    // Evitamos que el número crezca más allá de lo que el diseño soporta
    if (importe.toString().length >= VISOR_CONFIG.MAX_DIGITOS) return;

    setImporte((prev) => {
      if (val === "00") return prev * 100;
      return prev * 10 + parseInt(val);
    });
  };

  const handleDelete = () => {
    setImporte((prev) => Math.floor(prev / 10));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* VISOR CON FUENTE DINÁMICA Y ALTURA FIJA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "20px",
          height: "110px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Barra lateral indicadora dinámica */}
        <div
          style={{
            width: "8px",
            height: "100%",
            backgroundColor: activeColor,
            transition: "background-color 0.3s ease",
          }}
        />

        <div
          style={{
            flex: 1,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Signo Pesos con color dinámico */}
          <Text
            style={{
              fontSize: "28px",
              color: activeColor,
              fontWeight: "600",
              marginRight: "10px",
            }}
          >
            $
          </Text>

          {/* Importe Formateado */}
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: getFontSize(),
              letterSpacing: "-1.5px",
              color: importe > 0 ? "#000" : "#bfbfbf",
              lineHeight: 1,
              transition: "font-size 0.2s ease-in-out",
              textAlign: "right",
              wordBreak: "break-all",
            }}
          >
            {importe.toLocaleString("es-AR")}
          </Title>
        </div>
      </div>

      {/* COMPONENTE CALCULADORA */}
      <Calculadora
        onPress={handlePress}
        onDelete={handleDelete}
        activeColor={activeColor}
      />

      {/* BOTÓN CONTINUAR DINÁMICO */}
      <Button
        type="primary"
        block
        disabled={importe === 0}
        onClick={() => onNext(importe)}
        style={{
          marginTop: "20px",
          height: "64px",
          backgroundColor: activeColor,
          borderColor: activeColor,
          borderRadius: "16px",
          fontSize: "19px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: importe > 0 ? `0 6px 20px ${activeColor}40` : "none",
          transition: "all 0.3s ease",
        }}
      >
        CONTINUAR <MdChevronRight size={28} style={{ marginLeft: "8px" }} />
      </Button>

      <Text
        type="secondary"
        style={{ textAlign: "center", marginTop: "12px", fontSize: "12px" }}
      >
        Ingresá el monto total para continuar
      </Text>
    </div>
  );
};

export default StepImporte;
