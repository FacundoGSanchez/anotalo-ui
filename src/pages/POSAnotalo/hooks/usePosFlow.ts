import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { STEPS } from "../../../constants/posConstants";
import { useMovimientoSession } from "../../../context/MovimientoSessionContext";
import type { Movimiento, MovimientoTipo, LineItem, FormaPagoNormalized, Entity } from "@/types";

interface MovimientoPos {
  id?: number;
  tipo: MovimientoTipo;
  importe: number;
  lineItems: LineItem[];
  formaPago: string | null;
  formaPagos: FormaPagoNormalized[];
  entidad?: Entity | null;
}

interface PosFlowResult {
  currentStep: number;
  movimiento: MovimientoPos;
  handleNext: (data: Partial<MovimientoPos> & { entidad?: Entity; lineaItems?: LineItem[] }) => void;
  handleBack: () => void;
  closePos: () => void;
  resetMovement: () => void;
  setMovimiento: React.Dispatch<React.SetStateAction<MovimientoPos>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const usePosFlow = (): PosFlowResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateItems, endMovement, confirmExit } = useMovimientoSession();

  const [currentStep, setCurrentStep] = useState<number>(STEPS.IMPORTE);
  const [movimiento, setMovimiento] = useState<MovimientoPos>({
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

  const handleNext = (data: Partial<MovimientoPos> & { entidad?: Entity; lineaItems?: LineItem[] }): void => {
    const nuevoEstado = { ...movimiento, ...data };
    setMovimiento(nuevoEstado);

    if (currentStep === STEPS.IMPORTE) {
      setCurrentStep(STEPS.RESUMEN);
    } else if (currentStep === STEPS.RESUMEN) {
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

  const handleBack = (): void => {
    if (currentStep === STEPS.IMPORTE) {
      confirmExit("/", () => closePos());
    } else if (currentStep === STEPS.RESUMEN) {
      setCurrentStep(STEPS.IMPORTE);
    } else if (currentStep === STEPS.CONFIRMAR) {
      if (movimiento.entidad) {
        setCurrentStep(STEPS.ENTIDAD);
      } else if (movimiento.formaPago || movimiento.formaPagos?.length > 0) {
        setCurrentStep(STEPS.FORMA_PAGO);
      } else {
        setCurrentStep(STEPS.RESUMEN);
      }
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const closePos = (): void => {
    endMovement();
    const state = location.state as { returnPath?: string; from?: string } | null;
    const destination =
      state?.returnPath ||
      (state?.from === "movimientos" ? "/movimientos" : "/");
    navigate(destination);
  };

  const resetMovement = (): void => {
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
