import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Typography, Modal } from "antd";
import { MdChevronRight, MdKeyboard, MdClose, MdEdit, MdOutlineBackspace } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useCurrentOrg } from "../../../../hooks/useCurrentOrg";
import Calculadora from "./components/Calculadora";

const { Title, Text } = Typography;

const RUBRO_SIN_RUBRO = { id: 0, sigla: "", nombre: "Sin rubro", grupo: "" };

const StepImporte = ({ tipo, onNext, desktop, initialLineItems = [] }) => {
  const orgId = useCurrentOrg();

  const configPOS = useMemo(() => orgService.getConfigPOS(orgId), [orgId]);
  const usaRubro = configPOS.usaRubro !== false;

  const rubros = useMemo(() => orgService.getRubros(orgId), [orgId]);
  const rubrosOrdenados = useMemo(
    () => [...rubros].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [rubros],
  );
  const [currentValue, setCurrentValue] = useState(0);
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [showCalc, setShowCalc] = useState(false);
  const [activeTab, setActiveTab] = useState("calc");
  const [rubroModalOpen, setRubroModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const inputRef = useRef(null);

  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  const fmt = (v) => v.toLocaleString("es-AR");

  const getFontSize = (value) => {
    const largo = fmt(value).length;
    if (largo > 9) return "26px";
    if (largo > 7) return "32px";
    return "40px";
  };

  const addDigit = useCallback((val) => {
    setCurrentValue((prev) => {
      if (val === "00") {
        if (prev.toString().length >= VISOR_CONFIG.MAX_DIGITOS - 1) return prev;
        return prev * 100;
      }
      if (prev.toString().length >= VISOR_CONFIG.MAX_DIGITOS) return prev;
      return prev * 10 + parseInt(val);
    });
  }, []);

  const deleteDigit = useCallback(() => {
    setCurrentValue((prev) => Math.floor(prev / 10));
  }, []);

  const handleInputChange = useCallback((e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    setCurrentValue(num);
  }, []);

  const resetCurrent = useCallback(() => {
    setCurrentValue(0);
  }, []);

  const agregarItemConRubro = useCallback((rubro) => {
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
    (e) => {
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

  const eliminarItem = useCallback((id) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const cambiarRubroItem = useCallback((id, nuevoRubro) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rubro: nuevoRubro } : item,
      ),
    );
    setEditItemId(null);
    setRubroModalOpen(false);
  }, []);

  const total = lineItems.reduce((acc, item) => acc + item.importe, 0);

  useEffect(() => {
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [desktop]);

  const renderRubroModal = () => (
    <Modal
      open={rubroModalOpen}
      onCancel={() => { setRubroModalOpen(false); setEditItemId(null); }}
      footer={null}
      title="Seleccionar rubro"
      centered
      width={340}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
        {rubrosOrdenados.map((rubro) => {
          const isSelected = editItemId
            ? lineItems.find((i) => i.id === editItemId)?.rubro?.sigla === rubro.sigla
            : false;
          return (
            <button
              key={rubro.sigla}
              onClick={() => {
                if (editItemId) {
                  cambiarRubroItem(editItemId, rubro);
                } else {
                  agregarItemConRubro(rubro);
                }
              }}
              disabled={!editItemId && currentValue <= 0}
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

  const tabBtn = (tab) => ({
    flex: 1,
    height: "48px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    background: activeTab === tab ? activeColor : "transparent",
    color: activeTab === tab ? "#fff" : "#8c8c8c",
    transition: "all 0.2s",
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease" }}>
      {renderRubroModal()}

      <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "12px", padding: "3px", marginBottom: "12px" }}>
        <button onClick={() => setActiveTab("calc")} style={tabBtn("calc")}>Calculadora</button>
        <button onClick={() => setActiveTab("list")} style={tabBtn("list")}>Resumen {lineItems.length > 0 && `(${lineItems.length})`}</button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "calc" ? (
        <>
          {/* VISOR — two rows */}
          <div style={{ display: "flex", background: "#f8f9fa", borderRadius: "16px", marginBottom: "12px", height: desktop ? "90px" : "96px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ width: "8px", height: "100%", backgroundColor: activeColor, transition: "background-color 0.3s ease" }} />
            <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "24px" }}>
                <div style={{ minWidth: 0 }}>
                  {currentValue > 0 && (
                    <Button
                      type="text"
                      icon={<MdOutlineBackspace size={14} />}
                      onClick={deleteDigit}
                      style={{ color: "#ff4d4f", fontSize: "11px", height: "24px", width: "24px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                    />
                  )}
                </div>
                {lineItems.length > 0 && (
                  <Text style={{ fontSize: "11px", color: "#8c8c8c", fontWeight: 600, lineHeight: 1.3 }}>
                    Total $ {fmt(total)} ({lineItems.length} {lineItems.length === 1 ? "item" : "items"})
                  </Text>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 0, marginTop: "2px" }}>
                <Text style={{ fontSize: "28px", color: activeColor, fontWeight: "600" }}>$</Text>
                {desktop ? (
                  <input ref={inputRef} type="text" inputMode="numeric" value={currentValue > 0 ? fmt(currentValue) : ""} onChange={handleInputChange} onKeyDown={handleInputKeyDown} placeholder="0" style={{ flex: 1, border: "none", background: "transparent", fontSize: getFontSize(currentValue), fontWeight: 700, textAlign: "right", outline: "none", color: currentValue > 0 ? "#000" : "#bfbfbf", letterSpacing: "-1px", fontFamily: "inherit", marginLeft: "12px" }} />
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
              onPress={addDigit}
              onPlus={handlePlus}
              activeColor={activeColor}
              hasValue={currentValue > 0}
            />
          )}
          {desktop && (
            <Button type="text" icon={<MdKeyboard size={16} />} onClick={() => setShowCalc((c) => !c)} style={{ alignSelf: "flex-end", fontSize: "12px", color: "#8c8c8c", marginBottom: "8px" }}>
              {showCalc ? "Ocultar teclado" : "Mostrar teclado"}
            </Button>
          )}
        </>
      ) : (
        <>
          {lineItems.length > 0 ? (
            <div style={{ background: "#fafafa", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "12px 16px" }}>
              {lineItems.map((item, idx) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: idx < lineItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    {usaRubro ? (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: `${activeColor}12`,
                        color: activeColor,
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1 }}>{item.rubro?.sigla || ""}</span>
                        <span style={{ fontSize: "9px", fontWeight: 600, lineHeight: 1, opacity: 0.8 }}>{item.rubro?.nombre || ""}</span>
                      </div>
                    ) : (
                      <div style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: `${activeColor}12`,
                        color: activeColor,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        fontWeight: 800,
                      }}>
                        $
                      </div>
                    )}
                    <Text strong style={{ fontSize: "16px", color: "#262626" }}>$ {fmt(item.importe)}</Text>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    {usaRubro && (
                      <Button type="text" size="small" icon={<MdEdit size={15} />} onClick={() => { setEditItemId(item.id); setRubroModalOpen(true); }} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8c8c8c" }} />
                    )}
                    <Button type="text" danger size="small" icon={<MdClose size={15} />} onClick={() => eliminarItem(item.id)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Text type="secondary" style={{ fontSize: "14px" }}>No hay items cargados</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px", color: "#bfbfbf" }}>Usá la calculadora para agregar montos</Text>
            </div>
          )}

          <div style={{ marginTop: "16px", padding: "14px 20px", background: `${activeColor}0d`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${activeColor}18` }}>
            <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>{lineItems.length} {lineItems.length === 1 ? "item" : "items"}</Text>
            <Title level={4} style={{ margin: 0, color: activeColor, fontSize: "22px" }}>$ {fmt(total)}</Title>
          </div>

          <Button type="primary" block disabled={lineItems.length === 0} onClick={() => onNext({ importe: total, lineItems })} style={{ marginTop: "12px", height: "64px", backgroundColor: activeColor, borderColor: activeColor, borderRadius: "16px", fontSize: "19px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: lineItems.length > 0 ? `0 6px 20px ${activeColor}40` : "none", transition: "all 0.3s ease" }}>
            CONTINUAR <MdChevronRight size={28} style={{ marginLeft: "8px" }} />
          </Button>
        </>
      )}
    </div>
    </>
  );
};

export default StepImporte;
