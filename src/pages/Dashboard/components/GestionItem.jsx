import React from "react";
import { Typography } from "antd"; // Importación que faltaba

const { Text } = Typography;

const GestionItem = ({ icon, label, onClick, disabled }) => {
  // Estilos condicionales basados en el estado 'disabled'
  const itemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer", // Cursor de bloqueo
    transition: "transform 0.1s ease",
    opacity: disabled ? 0.5 : 1, // Se ve grisáceo/tenue
    filter: disabled ? "grayscale(1)" : "none", // Opcional: lo hace blanco y negro
  };

  const handlePress = (scale) => {
    if (!disabled) return { transform: `scale(${scale})` };
    return {};
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined} // Si está deshabilitado, no hace nada
      style={itemStyle}
      onMouseDown={(e) =>
        !disabled && (e.currentTarget.style.transform = "scale(0.95)")
      }
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        style={{
          fontSize: "28px",
          color: "#595959",
          marginBottom: "6px",
          background: "#f5f5f5",
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <Text style={{ fontSize: "12px", color: "#595959", fontWeight: "500" }}>
        {label}
      </Text>
    </div>
  );
};

export default GestionItem;
