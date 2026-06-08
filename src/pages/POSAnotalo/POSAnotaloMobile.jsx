import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "antd";

import { usePosFlow } from "./hooks/usePosFlow";
import { STEPS } from "../../constants/posConstants";

import PosHeader from "./components/PosHeader";

import StepTipo from "./components/steps/StepTipo";
import StepImporte from "./components/steps/StepImporte";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";

const { Content } = Layout;

const POSAnotaloMobile = () => {
  const locState = useLocation().state;
  const navigate = useNavigate();
  const {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    setCurrentStep,
    setMovimiento,
  } = usePosFlow();

  const finalizarRegistro = () => {
    setMovimiento({ tipo: null, importe: 0, formaPago: null, entidad: null });
    setCurrentStep(STEPS.TIPO);
    if (locState?.returnPath) {
      navigate(locState.returnPath);
    } else {
      closePos();
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
        <PosHeader
          currentStep={currentStep}
          tipo={movimiento.tipo}
          onBack={handleBack}
          onClose={closePos}
        />

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          {currentStep === STEPS.TIPO && (
            <StepTipo onNext={(tipo) => handleNext({ tipo })} />
          )}

          {currentStep === STEPS.IMPORTE && (
            <StepImporte
              desktop={false}
              tipo={movimiento.tipo}
              onNext={(monto) => handleNext({ importe: monto })}
            />
          )}

          {currentStep === STEPS.FORMA_PAGO && (
            <StepFormaPago
              tipo={movimiento.tipo}
              onNext={(forma) => handleNext({ formaPago: forma })}
            />
          )}

          {currentStep === STEPS.ENTIDAD && (
            <StepEntidad
              tipo={movimiento.tipo}
              formaPago={movimiento.formaPago}
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
