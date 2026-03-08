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

  // En tu hook usePosFlow
  useEffect(() => {
    // Asegúrate de usar tipoInicial (como envías en el Dashboard)
    if (location.state?.skipFirstStep && location.state?.tipoDirecto) {
      setMovimiento((prev) => ({
        ...prev,
        tipo: location.state.tipoDirecto,
      }));
      // Forzamos el paso al importe
      setCurrentStep(STEPS.IMPORTE);
    }
  }, [location.state]);

  const handleNext = (data) => {
    const nuevoEstado = { ...movimiento, ...data };
    setMovimiento(nuevoEstado);

    // Lógica: Si estoy en IMPORTE, decidir a dónde ir
    if (currentStep === STEPS.IMPORTE) {
      const esFlujoInterno =
        nuevoEstado.tipo === MOVIMIENTO_TIPOS.RETIRO ||
        nuevoEstado.tipo === MOVIMIENTO_TIPOS.INGRESO;

      if (esFlujoInterno) {
        // Configuramos valores por defecto y saltamos a confirmar
        setMovimiento((prev) => ({
          ...prev,
          ...data,
          formaPago: "Efectivo",
          entidad: { id: 0, nombre: "Caja Interna" },
        }));
        setCurrentStep(STEPS.CONFIRMAR);
      } else {
        // Flujo normal (Venta/Pago)
        setCurrentStep(STEPS.FORMA_PAGO);
      }
    } else {
      // Si estamos en cualquier otro paso, simplemente avanzar
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
