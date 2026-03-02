import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { STEPS, MOVIMIENTO_TIPOS } from "../../../constants/posConstants";

export const usePosFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(STEPS.TIPO);
  const [movimiento, setMovimiento] = useState({
    tipo: null,
    importe: 0,
    formaPago: null,
    entidad: null,
  });

  useEffect(() => {
    if (location.state?.skipFirstStep && location.state?.tipoInicial) {
      setMovimiento((prev) => ({ ...prev, tipo: location.state.tipoInicial }));
      setCurrentStep(STEPS.IMPORTE);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNext = (data) => {
    // 1. Calculamos el estado que queremos tener
    const nuevoEstado = { ...movimiento, ...data };

    // 2. Verificamos si es un flujo de caja (Ingreso/Retiro) en el paso del Importe
    const esFlujoInterno =
      nuevoEstado.tipo === MOVIMIENTO_TIPOS.RETIRO ||
      nuevoEstado.tipo === MOVIMIENTO_TIPOS.INGRESO;

    if (esFlujoInterno && currentStep === STEPS.IMPORTE) {
      // Seteamos todo de un solo golpe para evitar problemas de asincronía
      setMovimiento({
        ...nuevoEstado,
        formaPago: "Efectivo",
        entidad: { id: 0, nombre: "Caja Interna" },
      });
      setCurrentStep(STEPS.CONFIRMAR);
    } else {
      // Flujo normal (Venta/Pago)
      setMovimiento(nuevoEstado);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === STEPS.IMPORTE) {
      setCurrentStep(STEPS.TIPO);
    } else if (
      (movimiento.tipo === MOVIMIENTO_TIPOS.RETIRO ||
        movimiento.tipo === MOVIMIENTO_TIPOS.INGRESO) &&
      currentStep === STEPS.CONFIRMAR
    ) {
      setCurrentStep(STEPS.IMPORTE);
    } else if (currentStep === STEPS.TIPO) {
      closePos();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const closePos = () => {
    const destination =
      location.state?.from === "movimientos" ? "/movimientos" : "/";
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
