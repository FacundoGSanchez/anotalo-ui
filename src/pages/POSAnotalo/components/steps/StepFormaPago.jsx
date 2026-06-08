import React, { useEffect, useRef } from "react";
import { Card, Typography, Space } from "antd";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { useAuth } from "../../../../context/AuthContext";
import { orgService } from "../../../../services/orgService";

const { Text } = Typography;

const StepFormaPago = ({ tipo, onNext }) => {
  const { session } = useAuth();
  const orgId = session?.organizaciones?.[0]?.id;
  const containerRef = useRef(null);

  const formasPagoOrg = orgService.getFormasPago(orgId, tipo);

  const opcionesFiltradas = formasPagoOrg.filter((opt) => {
    if (tipo === MOVIMIENTO_TIPOS.PAGO && opt.key === "Cta Corriente")
      return false;
    if (tipo === MOVIMIENTO_TIPOS.COBRO && opt.key !== "Cta Corriente")
      return false;
    return true;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-fp-card]");
    if (cards.length > 0) {
      cards[0].focus();
    }
    const handleKeyDown = (e) => {
      const cardsArr = Array.from(container.querySelectorAll("[data-fp-card]"));
      const currentIndex = cardsArr.findIndex((c) => c === document.activeElement);
      if (e.key === "ArrowDown" || e.key === "Tab") {
        e.preventDefault();
        const next = (currentIndex + 1) % cardsArr.length;
        cardsArr[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + cardsArr.length) % cardsArr.length;
        cardsArr[prev]?.focus();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ flex: 1 }} ref={containerRef}>
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          {opcionesFiltradas.map((opt) => (
            <div
              key={opt.key}
              data-fp-card
              tabIndex={0}
              role="button"
              onClick={() => onNext(opt.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNext(opt.key);
                }
              }}
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                background: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                outline: "none",
                padding: "12px 20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = opt.color;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = opt.color;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}30`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
              }}
            >
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
                  }}
                >
                  {opt.icon}
                </div>
              </div>
            </div>
          ))}
        </Space>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Text
          type="secondary"
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          PASO 3 DE 4 | SELECCIONAR FORMA DE PAGO
        </Text>
      </div>
    </div>
  );
};

export default StepFormaPago;
