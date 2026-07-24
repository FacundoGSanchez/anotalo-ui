import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Typography, Modal } from "antd";
import { MdKeyboard, MdCheckCircle } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useCurrentOrg } from "../../../../hooks/useCurrentOrg";
import Calculadora from "./components/Calculadora";
import type { LineItem, Rubro, MovimientoTipo } from "@/types";

const { Title, Text } = Typography;

const RUBRO_SIN_RUBRO: Rubro = { id: 0, sigla: "", nombre: "Sin rubro", grupo: "" };

interface StepImporteProps {
  tipo: MovimientoTipo;
  onNext: (data: { importe: number; lineItems: LineItem[] }) => void;
  desktop: boolean;
  initialLineItems?: LineItem[];
  onItemsChange?: (items: LineItem[]) => void;
}

const StepImporte = ({ tipo, onNext, desktop, initialLineItems = [], onItemsChange }: StepImporteProps) => {
  const orgId = useCurrentOrg();

  const configPOS = useMemo(() => orgService.getConfigPOS(orgId), [orgId]);
  const usaRubro = configPOS.usaRubro !== false;

  const rubros: Rubro[] = useMemo(() => orgService.getRubros(orgId), [orgId]);
  const rubrosOrdenados = useMemo(
    () => [...rubros].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [rubros],
  );
  const [currentValue, setCurrentValue] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);
  const [showCalc, setShowCalc] = useState(false);
  const [rubroModalOpen, setRubroModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rubroListRef = useRef<HTMLDivElement>(null);

  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  const fmt = (v: number): string => v.toLocaleString("es-AR");

  const getFontSize = (value: number): string => {
    const largo = fmt(value).length;
    if (largo > 9) return "26px";
    if (largo > 7) return "32px";
    return "40px";
  };

  const addDigit = useCallback((val: string) => {
    setCurrentValue((prev) => {
      if (prev.toString().length >= VISOR_CONFIG.MAX_DIGITOS) return prev;
      return prev * 10 + parseInt(val);
    });
  }, []);

  const deleteDigit = useCallback(() => {
    setCurrentValue((prev) => Math.floor(prev / 10));
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    setCurrentValue(num);
  }, []);

  const resetCurrent = useCallback(() => {
    setCurrentValue(0);
  }, []);

  const agregarItemConRubro = useCallback((rubro: Rubro) => {
    if (currentValue <= 0) return;
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), importe: currentValue, rubro },
    ]);
    resetCurrent();
    if (desktop) {
      inputRef.current?.focus();
    }
    setRubroModalOpen(false);
  }, [currentValue, desktop, resetCurrent]);

  const agregarItemSimple = useCallback(() => {
    if (currentValue <= 0) return;
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), importe: currentValue, rubro: RUBRO_SIN_RUBRO },
    ]);
    resetCurrent();
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [currentValue, desktop, resetCurrent]);

  const handlePlus = useCallback(() => {
    if (currentValue <= 0) return;
    if (usaRubro) {
      setEditItemId(null);
      setRubroModalOpen(true);
    } else {
      agregarItemSimple();
    }
  }, [currentValue, usaRubro, agregarItemSimple]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && currentValue > 0) {
        if (usaRubro && rubros.length > 0) {
          setEditItemId(null);
          setRubroModalOpen(true);
        } else {
          agregarItemSimple();
        }
      }
    },
    [currentValue, agregarItemSimple, usaRubro, rubros],
  );

  const total = lineItems.reduce((acc, item) => acc + item.importe, 0);

  useEffect(() => {
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [desktop]);

  useEffect(() => {
    onItemsChange?.(lineItems);
  }, [lineItems, onItemsChange]);

  useEffect(() => {
    if (!rubroModalOpen) return;

    if (rubroListRef.current) {
      const firstBtn = rubroListRef.current.querySelector("button:not([disabled])") as HTMLElement | null;
      if (firstBtn) {
        firstBtn.focus();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRubroModalOpen(false);
        setEditItemId(null);
        return;
      }

      const key = e.key.toUpperCase();
      if (key.length !== 1) return;

      const matched = rubrosOrdenados.find((r) => r.sigla.toUpperCase() === key);
      if (matched) {
        e.preventDefault();
        if (editItemId) {
          setLineItems((prev) =>
            prev.map((item) =>
              item.id === editItemId ? { ...item, rubro: matched } : item,
            ),
          );
          setEditItemId(null);
          setRubroModalOpen(false);
        } else if (currentValue > 0) {
          agregarItemConRubro(matched);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rubroModalOpen, rubrosOrdenados, editItemId, currentValue, agregarItemConRubro]);

  const renderRubroModal = () => (
    <Modal
      open={rubroModalOpen}
      onCancel={() => { setRubroModalOpen(false); setEditItemId(null); }}
      footer={null}
      title="Seleccionar rubro"
      centered
      width={340}
    >
      <div ref={rubroListRef} style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
        {rubrosOrdenados.map((rubro) => {
          const isSelected = editItemId
            ? lineItems.find((i) => i.id === editItemId)?.rubro?.sigla === rubro.sigla
            : false;
          return (
            <button
              key={rubro.sigla}
              tabIndex={0}
              onClick={() => {
                if (editItemId) {
                  setLineItems((prev) =>
                    prev.map((item) =>
                      item.id === editItemId ? { ...item, rubro } : item,
                    ),
                  );
                  setEditItemId(null);
                  setRubroModalOpen(false);
                } else {
                  agregarItemConRubro(rubro);
                }
              }}
              disabled={!editItemId && currentValue <= 0}
              onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${activeColor}40`; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                border: `2px solid ${isSelected ? activeColor : "#e8e8e8"}`,
                background: isSelected ? `${activeColor}10` : "#fafafa",
                color: isSelected ? activeColor : "#595959",
                cursor: (!editItemId && currentValue <= 0) ? "default" : "pointer",
                textAlign: "left",
                width: "100%",
                outline: "none",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: `${activeColor}15`,
                color: activeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {rubro.sigla}
              </div>
              {rubro.nombre}
            </button>
          );
        })}
      </div>
    </Modal>
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease" }}>
        {renderRubroModal()}

        <div style={{ display: "flex", background: "#f8f9fa", borderRadius: "16px", marginBottom: "8px", height: desktop ? "90px" : "96px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <div style={{ width: "8px", height: "100%", backgroundColor: activeColor, transition: "background-color 0.3s ease" }} />
          <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", minHeight: "24px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 0, marginTop: "2px" }}>
              <Text style={{ fontSize: "28px", color: activeColor, fontWeight: "600" }}>$</Text>
              {desktop ? (
                <input ref={inputRef} tabIndex={1} type="text" inputMode="numeric" value={currentValue > 0 ? fmt(currentValue) : ""} onChange={handleInputChange} onKeyDown={handleInputKeyDown} placeholder="0" autoFocus={desktop} style={{ flex: 1, border: "none", background: "transparent", fontSize: getFontSize(currentValue), fontWeight: 700, textAlign: "right", color: currentValue > 0 ? "#000" : "#bfbfbf", letterSpacing: "-1px", fontFamily: "inherit", marginLeft: "12px" }} />
              ) : (
                <Title level={1} style={{ margin: 0, fontSize: getFontSize(currentValue), letterSpacing: "-1.5px", color: currentValue > 0 ? "#000" : "#bfbfbf", lineHeight: 1, transition: "font-size 0.2s ease-in-out", textAlign: "right", wordBreak: "break-all" }}>
                  {fmt(currentValue)}
                </Title>
              )}
            </div>
          </div>
        </div>

        {(desktop ? showCalc : true) && (
          <Calculadora
            btnTabIndex={-1}
            onPress={addDigit}
            onPlus={handlePlus}
            onBackspace={deleteDigit}
            activeColor={activeColor}
            hasValue={currentValue > 0}
          />
        )}

        {lineItems.length > 0 && (
          <button
            tabIndex={-1}
            onClick={() => onNext({ importe: total, lineItems })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 16px",
              marginTop: "10px",
              background: `${activeColor}0d`,
              border: `1px solid ${activeColor}20`,
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = activeColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${activeColor}20`; }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: `${activeColor}18`,
                color: activeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 800,
              }}>
                {lineItems.length}
              </div>
              <Text strong style={{ fontSize: "13px", color: "#595959" }}>
                {lineItems.length === 1 ? "item" : "items"}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Text strong style={{ fontSize: "15px", color: activeColor }}>
                $ {fmt(total)}
              </Text>
              <MdKeyboard size={14} style={{ color: activeColor, transform: "rotate(90deg)" }} />
            </div>
          </button>
        )}

        {lineItems.length > 0 && (
          <button
            onClick={() => onNext({ importe: total, lineItems })}
            style={{
              width: "100%",
              height: "48px",
              marginTop: "8px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              border: "none",
              background: activeColor,
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseDown={(e) => e.preventDefault()}
          >
            CONTINUAR
            <MdCheckCircle size={16} />
          </button>
        )}

        {desktop && !showCalc && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
            {currentValue > 0 && (
              <button
                tabIndex={2}
                onClick={(e) => { e.preventDefault(); handlePlus(); }}
                style={{
                  height: "56px",
                  borderRadius: "14px",
                  fontSize: "18px",
                  fontWeight: 700,
                  border: "none",
                  background: activeColor,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                AGREGAR
              </button>
            )}
          </div>
        )}
        {desktop && (
          <Button tabIndex={-1} type="text" icon={<MdKeyboard size={16} />} onClick={() => setShowCalc((c) => !c)} style={{ alignSelf: "flex-end", fontSize: "12px", color: "#8c8c8c", marginBottom: "8px" }}>
            {showCalc ? "Ocultar teclado" : "Mostrar teclado"}
          </Button>
        )}
      </div>
    </>
  );
};

export default StepImporte;
