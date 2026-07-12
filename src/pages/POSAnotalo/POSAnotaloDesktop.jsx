import { useState, useEffect, useCallback } from "react";

import { Typography, Card, Tag, Space, Button } from "antd";
import { MdClose, MdReceipt, MdPerson, MdWallet, MdShoppingCart, MdChevronRight } from "react-icons/md";

import { usePosFlow } from "./hooks/usePosFlow";
import {
  STEPS,
  POS_COLORS,
} from "../../constants/posConstants";
import { movimientoService } from "../../services/movimientoService";
import { useCurrentSucursal } from "../../hooks/useCurrentSucursal";
import { useMovimientoSession } from "../../context/MovimientoSessionContext";

import StepImporte from "./components/steps/StepImporte";
import StepResumenItem from "./components/steps/StepResumenItem";
import StepFormaPago from "./components/steps/StepFormaPago";
import StepEntidad from "./components/steps/StepEntidad";
import StepConfirmar from "./components/steps/StepConfirmar";
import ModalDetalleMovimiento from "../Reportes/Movimientos/components/ModalDetalleMovimiento";

const { Text, Title } = Typography;

const POSAnotaloDesktop = () => {
  const { sucursalId } = useCurrentSucursal();
  const { hasActiveItems, confirmExit, updateItems } = useMovimientoSession();

  const {
    currentStep,
    movimiento,
    handleNext,
    handleBack,
    closePos,
    resetMovement,
  } = usePosFlow();

  const [recentMovements, setRecentMovements] = useState([]);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);

  const loadRecent = useCallback(() => {
    const all = movimientoService.getAll() || [];
    const filtrados = sucursalId ? all.filter((m) => m.sucursalId === sucursalId) : all;
    setRecentMovements(filtrados.slice(-10).reverse());
  }, [sucursalId]);

  useEffect(() => {
    loadRecent();
    const handler = () => loadRecent();
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, [loadRecent]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (currentStep > STEPS.IMPORTE) {
          handleBack();
        } else {
          confirmExit("/", () => closePos());
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentStep, handleBack, closePos, confirmExit]);

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
            onItemsChange={(items) => updateItems(items.length)}
          />
        );
      case STEPS.RESUMEN:
        return (
          <StepResumenItem
            tipo={movimiento.tipo}
            lineItems={movimiento.lineItems || []}
            onNext={(data) => handleNext(data)}
            onRemoveItem={(id) => {
              const newItems = (movimiento.lineItems || []).filter((i) => i.id !== id);
              handleNext({ lineItems: newItems, importe: newItems.reduce((a, i) => a + i.importe, 0) });
            }}
          />
        );
      case STEPS.FORMA_PAGO:
        return (
          <StepFormaPago
            tipo={movimiento.tipo}
            importe={movimiento.importe}
            onBack={handleBack}
            onNext={(data) => handleNext(data)}
          />
        );
      case STEPS.ENTIDAD:
        return (
          <StepEntidad
            tipo={movimiento.tipo}
            formaPago={movimiento.formaPago}
            formaPagos={movimiento.formaPagos}
            onBack={handleBack}
            onNext={(ent) => handleNext({ entidad: ent })}
          />
        );
      case STEPS.CONFIRMAR:
        return (
          <StepConfirmar
            movimiento={movimiento}
            onBack={handleBack}
            onConfirm={finalizarRegistro}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      {/* HEADER with close button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 20px 0",
        }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<MdClose size={24} />}
          onClick={() => confirmExit("/", () => closePos())}
          style={{ color: "#8c8c8c" }}
        />
      </div>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "20px",
          padding: "12px 20px 20px",
          overflow: "hidden",
        }}
      >
        {/* LEFT — Step Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflow: "auto",
          }}
        >
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
                {renderStep()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Transaction summary + Recent movements */}
        <div
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflow: "auto",
            flexShrink: 0,
          }}
        >
          <Card
            size="small"
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
            styles={{ body: { padding: "14px 16px" } }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#8c8c8c",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              TRANSACCIÓN ACTUAL
            </Text>

            {movimiento.lineItems.length > 0 || movimiento.formaPago || movimiento.formaPagos?.length > 0 ? (
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <SidebarRow
                  icon={<MdShoppingCart size={16} color={POS_COLORS[movimiento.tipo] || "#8c8c8c"} />}
                  label="Tipo"
                  value={movimiento.tipo}
                  color={POS_COLORS[movimiento.tipo] || "#8c8c8c"}
                />
                {(movimiento.lineItems?.length > 0 || movimiento.importe > 0) && (
                  <SidebarRow
                    icon={<MdWallet size={16} color={POS_COLORS[movimiento.tipo] || "#8c8c8c"} />}
                    label="Importe"
                    value={`$ ${Number(movimiento.importe).toLocaleString("es-AR")} (${movimiento.lineItems?.length || 0} items)`}
                    color={POS_COLORS[movimiento.tipo] || "#8c8c8c"}
                  />
                )}
                {movimiento.formaPagos?.length > 0 ? (
                  movimiento.formaPagos.map((fp, i) => (
                    <SidebarRow
                      key={fp.key}
                      icon={<MdWallet size={16} color={POS_COLORS[movimiento.tipo] || "#8c8c8c"} />}
                      label={i === 0 ? "Forma de pago" : ""}
                      value={`${fp.key}: $${Number(fp.importe).toLocaleString("es-AR")}`}
                      color={POS_COLORS[movimiento.tipo] || "#8c8c8c"}
                    />
                  ))
                ) : movimiento.formaPago ? (
                  <SidebarRow
                    icon={<MdWallet size={16} color={POS_COLORS[movimiento.tipo] || "#8c8c8c"} />}
                    label="Forma de pago"
                    value={movimiento.formaPago}
                    color={POS_COLORS[movimiento.tipo] || "#8c8c8c"}
                  />
                ) : null}
                {movimiento.entidad && (
                  <SidebarRow
                    icon={<MdPerson size={16} color={POS_COLORS[movimiento.tipo] || "#8c8c8c"} />}
                    label="Entidad"
                    value={movimiento.entidad.nombre}
                    color={POS_COLORS[movimiento.tipo] || "#8c8c8c"}
                  />
                )}
              </Space>
            ) : (
              <Text type="secondary" style={{ fontSize: "12px", textAlign: "center", display: "block" }}>
                Iniciá una venta para ver el resumen
              </Text>
            )}
          </Card>

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
                }}
              >
                {recentMovements.map((m) => (
                  <div
                    key={m.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetalleMovimiento(m)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDetalleMovimiento(m); } }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 12px",
                      margin: "0 -12px",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "background 0.15s",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onFocus={(e) => e.currentTarget.style.background = "#f0f0f0"}
                    onBlur={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Tag
                        color={POS_COLORS[m.tipo] || "#d9d9d9"}
                        style={{
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 700,
                          border: "none",
                          margin: 0,
                          lineHeight: "18px",
                          padding: "0 5px",
                        }}
                      >
                        {m.tipo === "Venta" ? "V" : m.tipo === "Pago" ? "P" : m.tipo === "Cobro" ? "C" : "I"}
                      </Tag>
                      <div style={{ minWidth: 0 }}>
                        <Text
                          strong
                          style={{
                            fontSize: "12px",
                            color: "#595959",
                            display: "block",
                            lineHeight: "1.2",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {m.entidad?.nombre || "Caja Interna"}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "10px", lineHeight: "1.2" }}
                        >
                          {(m.formaPagos ? m.formaPagos.map(fp => fp.key).join(" + ") : m.formaPago)} · {m.fecha}
                        </Text>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0, marginLeft: "6px" }}>
                      <Text strong style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                        ${Number(m.importe).toLocaleString("es-AR")}
                      </Text>
                      <MdChevronRight size={16} color="#bfbfbf" />
                    </div>
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

      <ModalDetalleMovimiento
        visible={!!detalleMovimiento}
        movimiento={detalleMovimiento}
        onClose={() => setDetalleMovimiento(null)}
        onUpdateList={loadRecent}
      />
    </div>
  );
};

const SidebarRow = ({ icon, label, value, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: `${color}10`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <Text type="secondary" style={{ fontSize: "10px", display: "block", lineHeight: 1.2 }}>{label}</Text>
      <Text strong style={{ fontSize: "13px", display: "block", lineHeight: 1.4 }}>{value}</Text>
    </div>
  </div>
);

export default POSAnotaloDesktop;


