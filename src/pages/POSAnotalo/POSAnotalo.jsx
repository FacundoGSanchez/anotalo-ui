import React, { useState, useEffect } from "react";
import { Layout, Button, Typography } from "antd";
import { MdArrowBack, MdClose } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

// Importación de los pasos
import StepTipo from "./components/StepTipo";
import StepImporte from "./components/StepImporte";
import StepFormaPago from "./components/StepFormaPago";
import StepEntidad from "./components/StepEntidad";
import StepConfirmar from "./components/StepConfirmar";

const { Content } = Layout;
const { Text } = Typography;

const POSAnotalo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [movimiento, setMovimiento] = useState({
    tipo: null,
    importe: 0,
    formaPago: null,
    entidad: null,
  });

  // 1. EFECTO DE CAPTURA DESDE DASHBOARD
  useEffect(() => {
    if (location.state?.skipFirstStep && location.state?.tipoInicial) {
      setMovimiento((prev) => ({
        ...prev,
        tipo: location.state.tipoInicial,
      }));
      setCurrentStep(1); // Salto directo al teclado de importe

      // Limpiamos el state de la URL para evitar saltos indeseados al recargar
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 2. TÍTULOS DINÁMICOS PARA EL HEADER
  const getStepTitle = () => {
    if (currentStep === 0) return "Nuevo Movimiento";
    if (currentStep === 4) return "Confirmar Registro";
    return movimiento.tipo || "Registro";
  };

  const handleNext = (data) => {
    const nuevoEstado = { ...movimiento, ...data };
    setMovimiento(nuevoEstado);

    // FLUJO ESPECIAL RETIRO: Salta de Importe (1) a Confirmar (4)
    if (nuevoEstado.tipo === "Retiro" && currentStep === 1) {
      setMovimiento((prev) => ({
        ...prev,
        ...data,
        formaPago: "Efectivo",
        entidad: { id: 0, nombre: "Caja Interna" },
      }));
      setCurrentStep(4);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // Si está en Importe, vuelve a Selección de Tipo (Step 0)
      setCurrentStep(0);
    } else if (movimiento.tipo === "Retiro" && currentStep === 4) {
      // Tu lógica especial de Retiro que ya teníamos
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const finalizarRegistro = () => {
    // 1. Limpiamos el estado local del formulario
    setMovimiento({ tipo: null, importe: 0, formaPago: null, entidad: null });
    setCurrentStep(0);

    // 2. Lógica de redirección inteligente
    if (location.state?.from === "movimientos") {
      navigate("/movimientos"); // Vuelve a la lista si vino de ahí
    } else {
      navigate("/"); // Vuelve al dashboard por defecto
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Content
        style={{
          padding: "16px",
          maxWidth: "500px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* HEADER DE NAVEGACIÓN MEJORADO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Button
            type="text"
            shape="circle"
            icon={<MdArrowBack size={24} />}
            onClick={handleBack}
          />

          <div style={{ textAlign: "center" }}>
            <Text strong style={{ fontSize: "17px", display: "block" }}>
              {getStepTitle()}
            </Text>
            {currentStep > 0 && currentStep < 4 && (
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Paso {currentStep + 1} de 4
              </Text>
            )}
          </div>

          <Button
            type="text"
            shape="circle"
            icon={<MdClose size={24} />}
            onClick={() => {
              if (location.state?.from === "movimientos") {
                navigate("/movimientos");
              } else {
                navigate("/");
              }
            }}
            style={{ color: "#bfbfbf" }}
          />
        </div>

        {/* RENDERIZADO DE PASOS */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          {currentStep === 0 && (
            <StepTipo onNext={(tipo) => handleNext({ tipo })} />
          )}

          {currentStep === 1 && (
            <StepImporte
              tipo={movimiento.tipo}
              onNext={(monto) => handleNext({ importe: monto })}
            />
          )}

          {currentStep === 2 && (
            <StepFormaPago
              tipo={movimiento.tipo}
              onNext={(forma) => handleNext({ formaPago: forma })}
            />
          )}

          {currentStep === 3 && (
            <StepEntidad
              tipo={movimiento.tipo}
              formaPago={movimiento.formaPago}
              onNext={(ent) => handleNext({ entidad: ent })}
            />
          )}

          {currentStep === 4 && (
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
