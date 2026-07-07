import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { STEPS } from "../../../constants/posConstants";
import { useMovimientoSession } from "../../../context/MovimientoSessionContext";

export const usePosFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateItems, endMovement, confirmExit } = useMovimientoSession();

  const [currentStep, setCurrentStep] = useState(STEPS.IMPORTE);
  const [movimiento, setMovimiento] = useState({
    tipo: "Venta",
    importe: 0,
    lineItems: [],
    formaPago: null,
    formaPagos: [],
    entidad: null,
  });

  useEffect(() => {
    updateItems(movimiento.lineItems?.length || 0);
  }, [movimiento.lineItems, updateItems]);

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
      confirmExit("/", () => closePos());
    } else if (currentStep === STEPS.CONFIRMAR) {
      if (movimiento.entidad) {
        setCurrentStep(STEPS.ENTIDAD);
    } else if (movimiento.formaPago || movimiento.formaPagos?.length > 0) {
        setCurrentStep(STEPS.FORMA_PAGO);
      } else {
        setCurrentStep(STEPS.IMPORTE);
      }
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const closePos = () => {
    endMovement();
    const destination =
      location.state?.returnPath ||
      (location.state?.from === "movimientos" ? "/movimientos" : "/");
    navigate(destination);
  };

  const resetMovement = () => {
    setMovimiento({ tipo: "Venta", importe: 0, lineItems: [], formaPago: null, formaPagos: [], entidad: null });
    setCurrentStep(STEPS.IMPORTE);
    endMovement();
  };

  return {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    resetMovement,
    setMovimiento,
    setCurrentStep,
  };
};
