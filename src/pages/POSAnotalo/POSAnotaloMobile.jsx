import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "antd";

import { usePosFlow } from "./hooks/usePosFlow";
import { useMovimientoSession } from "../../context/MovimientoSessionContext";
import { STEPS } from "../../constants/posConstants";

import PosHeader from "./components/PosHeader";
import StepImporte from "./components/steps/StepImporte";
import StepResumenItem from "./components/steps/StepResumenItem";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";

const { Content } = Layout;

const POSAnotaloMobile = () => {
  const locState = useLocation().state;
  const navigate = useNavigate();
  const { hasActiveItems, confirmExit, updateItems } = useMovimientoSession();
  const {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    resetMovement,
    setMovimiento,
    setCurrentStep,
  } = usePosFlow();

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (hasActiveItems) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasActiveItems]);

  const finalizarRegistro = () => {
    resetMovement();
    if (locState?.returnPath) {
      navigate(locState.returnPath);
    } else {
      navigate("/");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Content
        style={{
          padding: "10px",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <PosHeader currentStep={currentStep} onBack={handleBack} onClose={() => confirmExit("/", () => closePos())} />

          {currentStep === STEPS.IMPORTE && (
            <StepImporte
              desktop={false}
              tipo={movimiento.tipo}
              initialLineItems={movimiento.lineItems || []}
              onNext={({ importe, lineItems }) => handleNext({ importe, lineItems })}
              onItemsChange={(items) => updateItems(items.length)}
            />
          )}

          {currentStep === STEPS.RESUMEN && (
            <StepResumenItem
              tipo={movimiento.tipo}
              lineItems={movimiento.lineItems || []}
              onNext={(data) => handleNext(data)}
              onRemoveItem={(id) => {
                const newItems = (movimiento.lineItems || []).filter((i) => i.id !== id);
                setMovimiento((prev) => ({
                  ...prev,
                  lineItems: newItems,
                  importe: newItems.reduce((a, i) => a + i.importe, 0),
                }));
                setCurrentStep(newItems.length === 0 ? STEPS.IMPORTE : STEPS.RESUMEN);
              }}
            />
          )}

          {currentStep === STEPS.FORMA_PAGO && (
            <StepFormaPago
              tipo={movimiento.tipo}
              importe={movimiento.importe}
              onNext={(data) => handleNext(data)}
            />
          )}

          {currentStep === STEPS.ENTIDAD && (
            <StepEntidad
              tipo={movimiento.tipo}
              formaPago={movimiento.formaPago}
              formaPagos={movimiento.formaPagos}
              onNext={(ent) => handleNext({ entidad: ent })}
            />
          )}

          {currentStep === STEPS.CONFIRMAR && (
            <StepConfirmar
              movimiento={movimiento}
              onConfirm={finalizarRegistro}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default POSAnotaloMobile;

