import React from "react";
import { Button, Typography } from "antd";
import { MdArrowBack, MdClose } from "react-icons/md";
import { STEPS } from "../../../constants/posConstants";

const { Text } = Typography;

const STEP_TITLES = {
  [STEPS.IMPORTE]: "Nueva Venta",
  [STEPS.RESUMEN]: "Resumen",
  [STEPS.FORMA_PAGO]: "Forma de Pago",
  [STEPS.ENTIDAD]: "Cliente",
  [STEPS.CONFIRMAR]: "Confirmar",
};

const PosHeader = ({ currentStep, onBack, onClose }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ width: "40px" }}>
        <Button
          type="text"
          shape="circle"
          icon={<MdArrowBack size={24} />}
          onClick={onBack}
        />
      </div>

      <div style={{ textAlign: "center", flex: 1 }}>
        <Text strong style={{ fontSize: "17px", display: "block" }}>
          {STEP_TITLES[currentStep] || "Venta"}
        </Text>
      </div>

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
