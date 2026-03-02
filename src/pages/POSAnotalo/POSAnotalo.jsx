import React from "react";
import { Layout } from "antd";

// Hooks y Constantes
import { usePosFlow } from "./hooks/usePosFlow";
import { STEPS } from "../../constants/posConstants";

// Componentes de UI
import PosHeader from "./components/PosHeader";

// Importación desde la nueva subcarpeta /steps
import StepTipo from "./components/steps/StepTipo";
import StepImporte from "./components/steps/StepImporte";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";

const { Content } = Layout;

const POSAnotalo = () => {
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
    // Reset del flujo
    setMovimiento({ tipo: null, importe: 0, formaPago: null, entidad: null });
    setCurrentStep(STEPS.TIPO);
    closePos();
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
          {/* RENDERIZADO CONDICIONAL POR PASOS */}

          {currentStep === STEPS.TIPO && (
            <StepTipo onNext={(tipo) => handleNext({ tipo })} />
          )}

          {currentStep === STEPS.IMPORTE && (
            <StepImporte
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

export default POSAnotalo;
