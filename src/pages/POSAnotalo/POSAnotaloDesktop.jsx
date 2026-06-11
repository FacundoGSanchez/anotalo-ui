import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Card, Tag } from "antd";
import {
  MdArrowBack,
  MdClose,
  MdOutlinePointOfSale,
  MdReceipt,
} from "react-icons/md";

import { usePosFlow } from "./hooks/usePosFlow";
import {
  STEPS,
  POS_COLORS,
} from "../../constants/posConstants";
import { movimientoService } from "../../services/movimientoService";

import StepImporte from "./components/steps/StepImporte";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";

const { Text, Title } = Typography;

const STEP_TITLE = {
  [STEPS.IMPORTE]: "Ingresar Importe",
  [STEPS.FORMA_PAGO]: "Forma de Pago",
  [STEPS.ENTIDAD]: "Seleccionar Entidad",
  [STEPS.CONFIRMAR]: "Confirmar Registro",
};

const POSAnotaloDesktop = () => {
  const locState = useLocation().state;
  const navigate = useNavigate();
  const stepFocusRef = useRef(null);

  const {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    setCurrentStep,
    setMovimiento,
  } = usePosFlow();

  useEffect(() => {
    stepFocusRef.current?.focus();
  }, [currentStep]);

  const [recentMovements, setRecentMovements] = useState([]);

  const loadRecent = useCallback(() => {
    const all = movimientoService.getAll() || [];
    setRecentMovements(all.slice(-10).reverse());
  }, []);

  useEffect(() => {
    loadRecent();
    const handler = () => loadRecent();
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, [loadRecent]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (currentStep > STEPS.IMPORTE) handleBack();
        else closePos();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentStep, handleBack, closePos]);

  const finalizarRegistro = () => {
    setMovimiento({ tipo: "Venta", importe: 0, lineItems: [], formaPago: null, entidad: null });
    setCurrentStep(STEPS.IMPORTE);
    if (locState?.returnPath) {
      navigate(locState.returnPath);
    } else {
      closePos();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.IMPORTE:
        return (
          <StepImporte
            desktop={true}
            tipo={movimiento.tipo}
            initialLineItems={movimiento.lineItems || []}
            onNext={({ importe, lineItems }) => handleNext({ importe, lineItems })}
          />
        );
      case STEPS.FORMA_PAGO:
        return (
          <StepFormaPago
            tipo={movimiento.tipo}
            onNext={(forma) => handleNext({ formaPago: forma })}
          />
        );
      case STEPS.ENTIDAD:
        return (
          <StepEntidad
            tipo={movimiento.tipo}
            formaPago={movimiento.formaPago}
            onNext={(ent) => handleNext({ entidad: ent })}
          />
        );
      case STEPS.CONFIRMAR:
        return (
          <StepConfirmar
            movimiento={movimiento}
            onConfirm={finalizarRegistro}
          />
        );
      default:
        return null;
    }
  };

  const activeColor = POS_COLORS[movimiento.tipo] || POS_COLORS.DEFAULT;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MdOutlinePointOfSale size={26} color={activeColor} />
          <Title level={5} style={{ margin: 0 }}>
            POS Anotalo
          </Title>
          {movimiento.tipo && (
            <Tag
              color={activeColor}
              style={{ borderRadius: "6px", marginLeft: 8 }}
            >
              {movimiento.tipo}
            </Tag>
          )}
        </div>
        <Button
          type="text"
          icon={<MdClose size={20} />}
          onClick={closePos}
          style={{ color: "#8c8c8c" }}
        >
          Cerrar
        </Button>
      </div>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "20px",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        {/* LEFT — Step Content + inline summary */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflow: "auto",
          }}
        >
          {/* Step card */}
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Step header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {currentStep > STEPS.IMPORTE && (
                  <Button
                    type="text"
                    icon={<MdArrowBack size={20} />}
                    onClick={handleBack}
                    style={{ marginLeft: -8 }}
                  />
                )}
                <Text strong style={{ fontSize: "15px" }}>
                  {STEP_TITLE[currentStep]}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        s === currentStep
                          ? activeColor
                          : s < currentStep
                            ? "#52c41a"
                            : "#e8e8e8",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "16px",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  maxWidth: "480px",
                  width: "100%",
                  minHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Hidden focus anchor for keyboard navigation */}
                <input
                  ref={stepFocusRef}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    height: 0,
                    width: 0,
                    pointerEvents: "none",
                  }}
                  tabIndex={0}
                  autoFocus
                />
                {renderStep()}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT — Recent movements */}
        <div
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflow: "auto",
            flexShrink: 0,
          }}
        >
          {/* Recent movements list */}
          <Card
            size="small"
            style={{
              flex: 1,
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
            }}
            styles={{ body: { padding: "14px 16px" } }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: "10px",
              }}
            >
              <MdReceipt size={15} color="#8c8c8c" />
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                }}
              >
                Movimientos recientes
              </Text>
            </div>

            {recentMovements.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                }}
              >
                {recentMovements.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Tag
                        color={POS_COLORS[m.tipo] || "#d9d9d9"}
                        style={{
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "none",
                          margin: 0,
                          lineHeight: "20px",
                          padding: "0 6px",
                        }}
                      >
                        {m.tipo === "Venta" ? "V" : m.tipo === "Pago" ? "P" : m.tipo === "Cobro" ? "C" : "I"}
                      </Tag>
                      <div style={{ minWidth: 0 }}>
                        <Text
                          strong
                          style={{
                            fontSize: "13px",
                            color: "#595959",
                            display: "block",
                            lineHeight: "1.3",
                          }}
                        >
                          {m.entidad?.nombre || "Caja Interna"}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "11px", lineHeight: "1.3" }}
                        >
                          {m.formaPago} · {m.fecha}
                        </Text>
                      </div>
                    </div>
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      ${Number(m.importe).toLocaleString("es-AR")}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text
                type="secondary"
                style={{ fontSize: "12px", textAlign: "center", display: "block" }}
              >
                No hay movimientos recientes
              </Text>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POSAnotaloDesktop;
