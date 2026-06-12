import React from "react";
import { Button, Typography } from "antd";
import { MdArrowBack, MdClose } from "react-icons/md";
import { STEPS } from "../../../constants/posConstants";

const { Text } = Typography;

const PosHeader = ({ currentStep, tipo, onBack, onClose }) => {
  const getStepTitle = () => {
    if (currentStep === STEPS.CONFIRMAR) return "Confirmar Registro";
    return "Venta";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
      }}
    >
      {/* 1. Lado Izquierdo: Botón Volver (Solo si NO es el primer paso) */}
      <div style={{ width: "40px" }}>
        {currentStep > STEPS.IMPORTE && (
          <Button
            type="text"
            shape="circle"
            icon={<MdArrowBack size={24} />}
            onClick={onBack}
          />
        )}
      </div>

      {/* 2. Centro: Título y Subtítulo */}
      <div style={{ textAlign: "center", flex: 1 }}>
        <Text strong style={{ fontSize: "17px", display: "block" }}>
          {getStepTitle()}
        </Text>
      </div>

      {/* 3. Lado Derecho: Botón Cerrar */}
      <div style={{ width: "40px", textAlign: "right" }}>
        <Button
          type="text"
          shape="circle"
          icon={<MdClose size={24} />}
          onClick={onClose}
          style={{ color: "#bfbfbf" }}
        />
      </div>
    </div>
  );
};

export default PosHeader;
