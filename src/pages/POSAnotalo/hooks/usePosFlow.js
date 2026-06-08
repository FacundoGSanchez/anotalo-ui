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
    const state = location.state;
    if (state?.skipFirstStep && state?.tipoDirecto) {
      const updates = {
        tipo: state.tipoDirecto,
      };
      if (state.entidadPreseleccionada) {
        updates.entidad = {
          id: state.entidadPreseleccionada.id,
          nombre: state.entidadPreseleccionada.nombre,
        };
        updates.formaPago = "Cta Corriente";
      }
      setMovimiento((prev) => ({
        ...prev,
        ...updates,
      }));
      setCurrentStep(STEPS.IMPORTE);
    }
  }, [location.state]);

  const handleNext = (data) => {
    const nuevoEstado = { ...movimiento, ...data };
    setMovimiento(nuevoEstado);

    if (currentStep === STEPS.IMPORTE) {
      const esFlujoInterno =
        nuevoEstado.tipo === MOVIMIENTO_TIPOS.RETIRO ||
        nuevoEstado.tipo === MOVIMIENTO_TIPOS.INGRESO;

      if (esFlujoInterno) {
        setMovimiento((prev) => ({
          ...prev,
          ...data,
          formaPago: "Efectivo",
          entidad: { id: 0, nombre: "Caja Interna" },
        }));
        setCurrentStep(STEPS.CONFIRMAR);
      } else if (nuevoEstado.tipo === MOVIMIENTO_TIPOS.COBRO) {
        setMovimiento((prev) => ({
          ...prev,
          ...data,
          formaPago: "Cta Corriente",
        }));
        if (nuevoEstado.entidad) {
          setCurrentStep(STEPS.CONFIRMAR);
        } else {
          setCurrentStep(STEPS.ENTIDAD);
        }
      } else if (nuevoEstado.formaPago && nuevoEstado.entidad) {
        setCurrentStep(STEPS.CONFIRMAR);
      } else if (nuevoEstado.formaPago) {
        setCurrentStep(STEPS.ENTIDAD);
      } else {
        setCurrentStep(STEPS.FORMA_PAGO);
      }
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
      if (movimiento.tipo && location.state?.skipFirstStep) {
        setCurrentStep(STEPS.TIPO);
      } else {
        setCurrentStep(STEPS.TIPO);
      }
    } else if (
      (movimiento.tipo === MOVIMIENTO_TIPOS.RETIRO ||
        movimiento.tipo === MOVIMIENTO_TIPOS.INGRESO ||
        movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) &&
      currentStep === STEPS.CONFIRMAR
    ) {
      setCurrentStep(STEPS.IMPORTE);
    } else if (
      currentStep === STEPS.CONFIRMAR &&
      (movimiento.formaPago === "Cta Corriente" || movimiento.entidad)
    ) {
      if (movimiento.formaPago && movimiento.entidad) {
        setCurrentStep(STEPS.IMPORTE);
      } else if (movimiento.formaPago) {
        setCurrentStep(STEPS.ENTIDAD);
      } else {
        setCurrentStep(STEPS.FORMA_PAGO);
      }
    } else if (currentStep === STEPS.TIPO) {
      closePos();
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
