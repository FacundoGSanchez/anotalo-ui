import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Typography, Space, Switch } from "antd";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useCurrentOrg } from "../../../../hooks/useCurrentOrg";
import CalcMultipleFormaPago from "./components/CalcMultipleFormaPago";
import type { FormaPagoItem, MovimientoTipo, FormaPagoNormalized } from "@/types";

const { Text } = Typography;

const formatMoney = (v: number | undefined): string => `$ ${Number(v || 0).toLocaleString("es-AR")}`;

interface StepFormaPagoProps {
  tipo: MovimientoTipo;
  importe?: number;
  onNext: (data: { formaPago: string; formaPagos: FormaPagoNormalized[] }) => void;
}

interface FormaPagoData {
  nombre: string;
  importe: number;
}

const StepFormaPago = ({ tipo, importe = 0, onNext }: StepFormaPagoProps) => {
  const orgId = useCurrentOrg();
  const containerRef = useRef<HTMLDivElement>(null);
  const [multiPago, setMultiPago] = useState(false);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [modalKey, setModalKey] = useState<string | null>(null);
  const isNewCheckRef = useRef(false);

  const formasPagoOrg: FormaPagoItem[] = orgService.getFormasPago(orgId, tipo);
  const modalForma = formasPagoOrg.find((f) => f.key === modalKey);

  const opcionesFiltradas = formasPagoOrg.filter((opt) => {
    if (
      (tipo === MOVIMIENTO_TIPOS.PAGO || tipo === MOVIMIENTO_TIPOS.COBRO) &&
      opt.key === "Cta Corriente"
    )
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
    if (cards.length > 0) (cards[0] as HTMLElement).focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      const cardsArr = Array.from(container.querySelectorAll("[data-fp-card]")) as HTMLElement[];
      const currentIndex = cardsArr.findIndex(
        (c) => c === document.activeElement,
      );
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

  const handleToggleMulti = useCallback((checked: boolean) => {
    setMultiPago(checked);
    if (!checked) setSelected({});
  }, []);

  const handleCheck = useCallback(
    (key: string, checked: boolean) => {
      if (checked) {
        isNewCheckRef.current = true;
        setSelected((prev) => ({ ...prev, [key]: 0 }));
        setModalKey(key);
      } else {
        setSelected((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        if (modalKey === key) setModalKey(null);
      }
    },
    [modalKey],
  );

  const getInitialForModal = useCallback(
    (key: string): number => {
      if (selected[key] !== undefined) return selected[key];
      return 0;
    },
    [selected],
  );

  const handleConfirmImporte = useCallback(
    (key: string, value: number) => {
      setSelected((prev) => {
        const otrosSum = Object.entries(prev)
          .filter(([k]) => k !== key)
          .reduce((s, [, v]) => s + (Number(v) || 0), 0);
        const maxPosible = Math.max(0, importe - otrosSum);
        return { ...prev, [key]: Math.min(value, maxPosible) };
      });
      setModalKey(null);
    },
    [importe],
  );

  const handleCancelImporte = useCallback(() => {
    if (isNewCheckRef.current && modalKey) {
      setSelected((prev) => {
        if (prev[modalKey] === undefined) return prev;
        const next = { ...prev };
        delete next[modalKey];
        return next;
      });
    }
    setModalKey(null);
  }, [modalKey]);

  const handleSingleSelect = useCallback(
    (key: string) => {
      onNext({ formaPago: key, formaPagos: [{ nombre: key, importe }] });
    },
    [importe, onNext],
  );

  const handleContinue = useCallback(() => {
    const entries = Object.entries(selected).filter(([, v]) => Number(v) > 0);
    if (entries.length === 0) return;
    const formaPagos: FormaPagoNormalized[] = entries.map(([key, val]) => ({
      nombre: key,
      importe: Number(val),
    }));
    onNext({ formaPago: entries[0][0], formaPagos });
  }, [selected, onNext]);

  const cardStyle = (opt: FormaPagoItem, isChecked: boolean): React.CSSProperties => ({
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
        <Switch checked={multiPago} onChange={handleToggleMulti} size="small" />
      </div>

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
                    e.currentTarget.style.borderColor = opt.color || "#f0f0f0";
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0,0,0,0.02)";
                  }
                }}
                onFocus={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = opt.color || "#f0f0f0";
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${opt.color}30`;
                  }
                }}
                onBlur={(e) => {
                  if (!multiPago) {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0,0,0,0.02)";
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
                      {isChecked ? (
                        <MdCheckCircle />
                      ) : (
                        <MdRadioButtonUnchecked />
                      )}
                    </div>

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

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isChecked) {
                          isNewCheckRef.current = false;
                          setModalKey(opt.key);
                        } else {
                          handleCheck(opt.key, true);
                        }
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "8px",
                        background: isChecked
                          ? `${opt.color}12`
                          : "transparent",
                        border: `1px solid ${isChecked ? opt.color : "transparent"}`,
                        cursor: "pointer",
                        flexShrink: 0,
                        minWidth: "90px",
                        textAlign: "right",
                        transition: "all 0.15s",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: "14px",
                          color: isChecked ? opt.color : "#d9d9d9",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isChecked ? formatMoney(selected[opt.key]) : "$ 0"}
                      </Text>
                    </div>
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

      {multiPago && (
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "12px",
            padding: "10px 14px",
            border: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div>
              <Text
                style={{
                  fontSize: "11px",
                  color: "#8c8c8c",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                TOTAL
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                {formatMoney(importe)}
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text
                style={{
                  fontSize: "11px",
                  color: "#8c8c8c",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                ASIGNADO
              </Text>
              <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
                {formatMoney(asignado)}
              </Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text
                style={{
                  fontSize: "11px",
                  color: "#8c8c8c",
                  display: "block",
                  fontWeight: 600,
                }}
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
        </div>
      )}

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
            background:
              saldo === 0 && selectedCount > 0 ? "#52c41a" : "#d9d9d9",
            color: saldo === 0 && selectedCount > 0 ? "#fff" : "#a6a6a6",
            cursor:
              saldo === 0 && selectedCount > 0 ? "pointer" : "not-allowed",
            transition: "all 0.15s",
            width: "100%",
            letterSpacing: "0.5px",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          CONTINUAR
        </button>
      )}

      {modalForma && (
        <CalcMultipleFormaPago
          open={!!modalKey}
          formaLabel={modalForma.label}
          formaColor={modalForma.color || "#1890ff"}
          initialValue={selected[modalKey!] ?? getInitialForModal(modalKey!)}
          importe={importe}
          saldo={saldo}
          onConfirm={(value: number) => {
            handleConfirmImporte(modalKey!, value);
          }}
          onCancel={handleCancelImporte}
        />
      )}
    </div>
  );
};

export default StepFormaPago;
