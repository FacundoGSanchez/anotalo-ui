import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Typography, Space, Switch, InputNumber } from "antd";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useCurrentOrg } from "../../../../hooks/useCurrentOrg";

const { Text } = Typography;

const formatMoney = (v) =>
  `$ ${Number(v || 0).toLocaleString("es-AR")}`;

const StepFormaPago = ({ tipo, importe = 0, onNext, onBack }) => {
  const orgId = useCurrentOrg();
  const containerRef = useRef(null);
  const [multiPago, setMultiPago] = useState(false);
  const [selected, setSelected] = useState({});

  const formasPagoOrg = orgService.getFormasPago(orgId, tipo);

  const opcionesFiltradas = formasPagoOrg.filter((opt) => {
    if ((tipo === MOVIMIENTO_TIPOS.PAGO || tipo === MOVIMIENTO_TIPOS.COBRO) && opt.key === "Cta Corriente")
      return false;
    return true;
  });

  const asignado = useMemo(
    () => Object.values(selected).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [selected],
  );
  const saldo = importe - asignado;
  const selectedCount = Object.keys(selected).length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || multiPago) return;
    const cards = container.querySelectorAll("[data-fp-card]");
    if (cards.length > 0) cards[0].focus();
    const handleKeyDown = (e) => {
      const cardsArr = Array.from(container.querySelectorAll("[data-fp-card]"));
      const currentIndex = cardsArr.findIndex((c) => c === document.activeElement);
      if (e.key === "ArrowDown" || e.key === "Tab") {
        if (currentIndex === cardsArr.length - 1) return;
        e.preventDefault();
        cardsArr[currentIndex + 1]?.focus();
      } else if (e.key === "ArrowUp") {
        if (currentIndex <= 0) return;
        e.preventDefault();
        cardsArr[currentIndex - 1]?.focus();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [multiPago]);

  const handleToggleMulti = useCallback((checked) => {
    setMultiPago(checked);
    if (!checked) setSelected({});
  }, []);

  const handleCheck = useCallback((key, checked) => {
    if (checked) {
      setSelected((prev) => {
        const keys = Object.keys(prev);
        if (keys.length === 0) {
          return { [key]: importe };
        }
        const currentSum = Object.values(prev).reduce((s, v) => s + (Number(v) || 0), 0);
        const resto = importe - currentSum;
        return { ...prev, [key]: Math.max(0, resto) };
      });
    } else {
      setSelected((prev) => {
        const next = { ...prev };
        delete next[key];
        const keys = Object.keys(next);
        if (keys.length === 1) {
          next[keys[0]] = importe;
        }
        return next;
      });
    }
  }, [importe]);

  const handleImporteChange = useCallback((key, value) => {
    const numVal = Number(value) || 0;
    setSelected((prev) => {
      const otrosSum = Object.entries(prev)
        .filter(([k]) => k !== key)
        .reduce((s, [, v]) => s + (Number(v) || 0), 0);
      const maxPosible = Math.max(0, importe - otrosSum);
      return { ...prev, [key]: Math.min(numVal, maxPosible) };
    });
  }, [importe]);

  const handleSingleSelect = useCallback((key) => {
    onNext({ formaPago: key, formaPagos: [{ key, importe }] });
  }, [importe, onNext]);

  const handleContinue = useCallback(() => {
    const entries = Object.entries(selected).filter(([, v]) => Number(v) > 0);
    if (entries.length === 0) return;
    const formaPagos = entries.map(([key, importe]) => ({ key, importe: Number(importe) }));
    onNext({ formaPago: entries[0][0], formaPagos });
  }, [selected, onNext]);

  const cardStyle = (opt, isChecked) => ({
    borderRadius: "16px",
    border: `1px solid ${isChecked ? opt.color : "#f0f0f0"}`,
    background: isChecked ? `${opt.color}08` : "#ffffff",
    boxShadow: isChecked
      ? `0 0 0 2px ${opt.color}20`
      : "0 2px 6px rgba(0,0,0,0.02)",
    transition: "all 0.2s ease",
    cursor: multiPago ? "default" : "pointer",
    outline: "none",
    padding: multiPago ? "8px 16px" : "12px 20px",
    userSelect: "none",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
        gap: "12px",
      }}
    >
      {/* TOGGLE MULTI PAGO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 4px",
          borderRadius: "12px",
          background: "#fafafa",
        }}
      >
        <Text
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#595959",
            letterSpacing: "0.3px",
          }}
        >
          PAGO MÚLTIPLE
        </Text>
        <Switch
          checked={multiPago}
          onChange={handleToggleMulti}
          size="small"
        />
      </div>

      {/* CARDS */}
      <div style={{ flex: 1 }} ref={containerRef}>
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          {opcionesFiltradas.map((opt) => {
            const isChecked = selected[opt.key] !== undefined;
            return (
              <div
                key={opt.key}
                data-fp-card
                tabIndex={multiPago ? -1 : 0}
                role={multiPago ? "presentation" : "button"}
                onClick={() => {
                  if (!multiPago) handleSingleSelect(opt.key);
                }}
                onKeyDown={(e) => {
                  if (multiPago) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSingleSelect(opt.key);
                  }
                }}
                style={cardStyle(opt, isChecked)}
                onMouseEnter={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = opt.color;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                  }
                }}
                onFocus={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = opt.color;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}30`;
                  }
                }}
                onBlur={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                  }
                }}
              >
                {multiPago ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* CHECKBOX */}
                    <div
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheck(opt.key, !isChecked);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCheck(opt.key, !isChecked);
                        }
                      }}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        color: isChecked ? opt.color : "#d9d9d9",
                        fontSize: "24px",
                        transition: "all 0.15s",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = `${opt.color}15`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {isChecked ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
                    </div>

                    {/* LABEL + ICON */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          color: opt.color,
                          backgroundColor: `${opt.color}15`,
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {opt.icon}
                      </div>
                      <Text
                        strong
                        style={{
                          fontSize: "14px",
                          color: "#262626",
                          letterSpacing: "0.3px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {opt.label.toUpperCase()}
                      </Text>
                    </div>

                    {/* INPUT IMPORTE */}
                    <InputNumber
                      value={isChecked ? selected[opt.key] : 0}
                      disabled={!isChecked}
                      onChange={(val) => handleImporteChange(opt.key, val)}
                      min={0}
                      max={importe}
                      formatter={(v) => `$ ${v}`}
                      parser={(v) => v.replace(/[^0-9]/g, "")}
                      style={{
                        width: "120px",
                        borderRadius: "10px",
                        flexShrink: 0,
                      }}
                      size="small"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: "16px",
                        color: "#262626",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {opt.label.toUpperCase()}
                    </Text>
                    <div
                      style={{
                        fontSize: "24px",
                        color: opt.color,
                        backgroundColor: `${opt.color}15`,
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {opt.icon}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Space>
      </div>

      {/* SUMMARY BAR — only in multiPago mode */}
      {multiPago && (
        <div
          style={{
            background: saldo === 0 ? "#f6ffed" : "#fffbe6",
            borderRadius: "12px",
            padding: "10px 14px",
            border: `1px solid ${saldo === 0 ? "#b7eb8f" : "#ffe58f"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <Text
                style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}
              >
                TOTAL
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                {formatMoney(importe)}
              </Text>
            </div>
            <div>
              <Text
                style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}
              >
                ASIGNADO
              </Text>
              <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
                {formatMoney(asignado)}
              </Text>
            </div>
            <div>
              <Text
                style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}
              >
                SALDO
              </Text>
              <Text
                strong
                style={{
                  fontSize: "16px",
                  color: saldo === 0 ? "#52c41a" : "#faad14",
                }}
              >
                {saldo === 0 ? "✓ $0" : formatMoney(saldo)}
              </Text>
            </div>
          </div>
          {saldo === 0 && selectedCount > 0 && (
            <MdCheckCircle size={22} color="#52c41a" />
          )}
        </div>
      )}

      {/* CONTINUAR — only in multiPago mode */}
      {multiPago && (
        <button
          onClick={handleContinue}
          disabled={saldo !== 0 || selectedCount === 0}
          style={{
            height: "52px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 700,
            border: "none",
            background: saldo === 0 && selectedCount > 0 ? "#52c41a" : "#d9d9d9",
            color: saldo === 0 && selectedCount > 0 ? "#fff" : "#a6a6a6",
            cursor: saldo === 0 && selectedCount > 0 ? "pointer" : "not-allowed",
            transition: "all 0.15s",
            width: "100%",
            letterSpacing: "0.5px",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {saldo !== 0
            ? `CONTINUAR (${formatMoney(saldo)} pendiente)`
            : "CONTINUAR"}
        </button>
      )}

      {/* VOLVER */}
      {onBack && (
        <button
          tabIndex={0}
          onClick={onBack}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.color = "#1890ff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.color = "#8c8c8c"; }}
          style={{
            height: "50px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 600,
            border: "2px solid #d9d9d9",
            background: "#fff",
            color: "#8c8c8c",
            cursor: "pointer",
            transition: "all 0.15s",
            width: "100%",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          ← VOLVER
        </button>
      )}
    </div>
  );
};

export default StepFormaPago;
