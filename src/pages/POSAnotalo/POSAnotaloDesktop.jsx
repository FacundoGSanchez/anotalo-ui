import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Card, Tag, Divider } from "antd";
import {
  MdArrowBack,
  MdClose,
  MdOutlinePointOfSale,
  MdReceipt,
  MdCheckCircle,
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { usePosFlow } from "./hooks/usePosFlow";
import {
  STEPS,
  POS_COLORS,
  MOVIMIENTO_TIPOS,
} from "../../constants/posConstants";
import { movimientoService } from "../../services/movimientoService";

import StepTipo from "./components/steps/StepTipo";
import StepImporte from "./components/steps/StepImporte";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";

const { Text, Title } = Typography;

const STEP_TITLE = {
  [STEPS.TIPO]: "Seleccionar Tipo",
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
        if (currentStep > STEPS.TIPO) handleBack();
        else closePos();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentStep, handleBack, closePos]);

  // Yearly summary from recent movements
  const yearlyTotals = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const thisYear = recentMovements.filter(
      (m) => new Date(m.fecha).getFullYear() === currentYear,
    );
    const ventas = thisYear
      .filter((m) => m.tipo === MOVIMIENTO_TIPOS.VENTA)
      .reduce((s, m) => s + Number(m.importe), 0);
    const cobros = thisYear
      .filter((m) => m.tipo === MOVIMIENTO_TIPOS.COBRO)
      .reduce((s, m) => s + Number(m.importe), 0);
    const pagos = thisYear
      .filter((m) => m.tipo === MOVIMIENTO_TIPOS.PAGO)
      .reduce((s, m) => s + Number(m.importe), 0);
    return { ventas, cobros, pagos };
  }, [recentMovements]);

  const finalizarRegistro = () => {
    setMovimiento({ tipo: null, importe: 0, formaPago: null, entidad: null });
    setCurrentStep(STEPS.TIPO);
    if (locState?.returnPath) {
      navigate(locState.returnPath);
    } else {
      closePos();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.TIPO:
        return <StepTipo onNext={(tipo) => handleNext({ tipo })} />;
      case STEPS.IMPORTE:
        return (
          <StepImporte
            desktop={true}
            tipo={movimiento.tipo}
            onNext={(monto) => handleNext({ importe: monto })}
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

  const summaryItems = [
    { label: "Tipo", value: movimiento.tipo || "—", key: "tipo" },
    {
      label: "Importe",
      value: movimiento.importe
        ? `$ ${Number(movimiento.importe).toLocaleString("es-AR")}`
        : "—",
      key: "importe",
    },
    { label: "Forma de Pago", value: movimiento.formaPago || "—", key: "fp" },
    {
      label: "Entidad",
      value: movimiento.entidad?.nombre || "—",
      key: "ent",
    },
  ];

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
                {currentStep > STEPS.TIPO && (
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
                {[0, 1, 2, 3, 4].map((s) => (
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

          {/* Inline Transaction Summary */}
          {movimiento.tipo && (
            <Card
              size="small"
              style={{
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
                background: "#fafafa",
              }}
              styles={{ body: { padding: "12px 16px" } }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#8c8c8c",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Resumen de transacción
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 16px",
                }}
              >
                {summaryItems.map((item) => (
                  <div key={item.key}>
                    <Text
                      type="secondary"
                      style={{ fontSize: "10px", display: "block" }}
                    >
                      {item.label}
                    </Text>
                    <Text strong style={{ fontSize: "13px" }}>
                      {item.value}
                    </Text>
                  </div>
                ))}
              </div>
              {currentStep === STEPS.CONFIRMAR && (
                <>
                  <Divider style={{ margin: "8px 0" }} />
                  <Text
                    style={{
                      fontSize: "12px",
                      color: "#52c41a",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    <MdCheckCircle
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />
                    Todos los datos completos
                  </Text>
                </>
              )}
            </Card>
          )}
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
          {/* Daily summary */}
          <Card
            size="small"
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
            }}
            styles={{ body: { padding: "14px 16px" } }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#8c8c8c",
                display: "block",
                marginBottom: "10px",
                textTransform: "uppercase",
              }}
            >
              {dayjs().locale("es").format("dddd, DD [de] MMMM")} · Resumen de Hoy
            </Text>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <Text style={{ fontSize: "12px" }}>Ventas</Text>
              <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>
                ${yearlyTotals.ventas.toLocaleString("es-AR")}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <Text style={{ fontSize: "12px" }}>Cobros</Text>
              <Text strong style={{ fontSize: "12px", color: "#eb2f96" }}>
                ${yearlyTotals.cobros.toLocaleString("es-AR")}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: "12px" }}>Pagos</Text>
              <Text strong style={{ fontSize: "12px", color: "#fa8c16" }}>
                ${yearlyTotals.pagos.toLocaleString("es-AR")}
              </Text>
            </div>
          </Card>

          {/* Recent movements list — ReporteCaja style */}
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
