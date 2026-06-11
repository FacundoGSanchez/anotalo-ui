import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { STEPS } from "../../../constants/posConstants";

export const usePosFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(STEPS.IMPORTE);
  const [movimiento, setMovimiento] = useState({
    tipo: "Venta",
    importe: 0,
    lineItems: [],
    formaPago: null,
    entidad: null,
  });

  const handleNext = (data) => {
    const nuevoEstado = { ...movimiento, ...data };
    setMovimiento(nuevoEstado);

    if (currentStep === STEPS.IMPORTE) {
      setCurrentStep(STEPS.FORMA_PAGO);
    } else if (currentStep === STEPS.FORMA_PAGO) {
      if (nuevoEstado.entidad) {
        setCurrentStep(STEPS.CONFIRMAR);
      } else {
        setCurrentStep(STEPS.ENTIDAD);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === STEPS.IMPORTE) {
      closePos();
    } else if (currentStep === STEPS.CONFIRMAR) {
      if (movimiento.entidad) {
        setCurrentStep(STEPS.ENTIDAD);
      } else if (movimiento.formaPago) {
        setCurrentStep(STEPS.FORMA_PAGO);
      } else {
        setCurrentStep(STEPS.IMPORTE);
      }
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const closePos = () => {
    const destination =
      location.state?.returnPath ||
      (location.state?.from === "movimientos" ? "/movimientos" : "/");
    navigate(destination);
  };

  return {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    setMovimiento,
    setCurrentStep,
  };
};
