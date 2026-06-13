import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Typography, Modal } from "antd";
import { MdChevronRight, MdKeyboard, MdClose, MdEdit } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useAuth } from "../../../../context/AuthContext";
import Calculadora from "./components/Calculadora";

const { Title, Text } = Typography;

const RUBRO_SIN_RUBRO = { id: 0, sigla: "", nombre: "Sin rubro", grupo: "" };

const StepImporte = ({ tipo, onNext, desktop, initialLineItems = [] }) => {
  const { session } = useAuth();
  const orgId = session?.organizaciones?.[0]?.id;

  const configPOS = useMemo(() => orgService.getConfigPOS(orgId), [orgId]);
  const usaRubro = configPOS.usaRubro !== false;

  const rubros = useMemo(() => orgService.getRubros(orgId), [orgId]);
  const visibleRubros = rubros.slice(0, 3);
  const grupos = useMemo(() => [...new Set(rubros.map((r) => r.grupo))], [rubros]);
  const [currentValue, setCurrentValue] = useState(0);
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [showCalc, setShowCalc] = useState(false);
  const [activeTab, setActiveTab] = useState("calc");
  const [rubroModalOpen, setRubroModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const inputRef = useRef(null);

  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  const getFontSize = (value) => {
    const largo = value.toLocaleString("es-AR").length;
    if (largo > 9) return VISOR_CONFIG.SIZES.SMALL;
    if (largo > 7) return VISOR_CONFIG.SIZES.MEDIUM;
    return VISOR_CONFIG.SIZES.DEFAULT;
  };

  const addDigit = useCallback((val) => {
    setCurrentValue((prev) => {
      if (prev.toString().length >= VISOR_CONFIG.MAX_DIGITOS) return prev;
      if (val === "00") return prev * 100;
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

  const agregarItemConRubro = useCallback((rubro) => {
    if (currentValue <= 0) return;
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), importe: currentValue, rubro },
    ]);
    setCurrentValue(0);
    if (desktop) {
      inputRef.current?.focus();
    }
    setRubroModalOpen(false);
  }, [currentValue, desktop]);

  const agregarItemSimple = useCallback(() => {
    if (currentValue <= 0) return;
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), importe: currentValue, rubro: RUBRO_SIN_RUBRO },
    ]);
    setCurrentValue(0);
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [currentValue, desktop]);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && currentValue > 0) {
        if (usaRubro && rubros.length > 0) {
          agregarItemConRubro(rubros[0]);
        } else {
          agregarItemSimple();
        }
      }
    },
    [currentValue, agregarItemConRubro, agregarItemSimple, usaRubro, rubros],
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

  const tabStyle = (isActive) => ({
    flex: 1,
    height: "44px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    background: isActive ? activeColor : "#f0f0f0",
    color: isActive ? "#fff" : "#8c8c8c",
  });

  const btnBase = (disabled) => ({
    flex: 1,
    height: "56px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 700,
    border: `2px solid ${disabled ? "#e8e8e8" : activeColor}`,
    background: disabled ? "#fafafa" : `${activeColor}10`,
    color: disabled ? "#bfbfbf" : activeColor,
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.15s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1px",
    outline: "none",
    lineHeight: 1.2,
  });

  const renderRubroModal = () => (
    <Modal
      open={rubroModalOpen}
      onCancel={() => { setRubroModalOpen(false); setEditItemId(null); }}
      footer={null}
      title="Seleccionar rubro"
      centered
      width={340}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
        {grupos.map((grupo) => (
          <div key={grupo}>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
              {grupo}
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {rubros.filter((r) => r.grupo === grupo).map((rubro) => {
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
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: `2px solid ${isSelected ? activeColor : "#e8e8e8"}`,
                      background: isSelected ? `${activeColor}10` : "#fafafa",
                      color: isSelected ? activeColor : "#595959",
                      cursor: (!editItemId && currentValue <= 0) ? "default" : "pointer",
                      outline: "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {rubro.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease" }}>
      {renderRubroModal()}

      {/* TABS at top */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={() => setActiveTab("calc")} style={tabStyle(activeTab === "calc")}>Calculadora</button>
        <button onClick={() => setActiveTab("list")} style={tabStyle(activeTab === "list")}>Resumen {lineItems.length > 0 && `(${lineItems.length})`}</button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "calc" ? (
        <>
          {/* VISOR inside Calculadora tab */}
          <div style={{ display: "flex", alignItems: "center", background: "#f8f9fa", borderRadius: "16px", marginBottom: "12px", height: desktop ? "72px" : "80px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ width: "8px", height: "100%", backgroundColor: activeColor, transition: "background-color 0.3s ease" }} />
            <div style={{ flex: 1, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "28px", color: activeColor, fontWeight: "600", marginRight: "10px" }}>$</Text>
              {desktop ? (
                <input ref={inputRef} type="text" inputMode="numeric" value={currentValue > 0 ? currentValue.toLocaleString("es-AR") : ""} onChange={handleInputChange} onKeyDown={handleInputKeyDown} placeholder="0" style={{ flex: 1, border: "none", background: "transparent", fontSize: getFontSize(currentValue), fontWeight: 700, textAlign: "right", outline: "none", color: currentValue > 0 ? "#000" : "#bfbfbf", letterSpacing: "-1px", fontFamily: "inherit" }} />
              ) : (
                <Title level={1} style={{ margin: 0, fontSize: getFontSize(currentValue), letterSpacing: "-1.5px", color: currentValue > 0 ? "#000" : "#bfbfbf", lineHeight: 1, transition: "font-size 0.2s ease-in-out", textAlign: "right", wordBreak: "break-all" }}>
                  {currentValue.toLocaleString("es-AR")}
                </Title>
              )}
            </div>
          </div>

          {(desktop ? showCalc : true) && (
            <Calculadora onPress={addDigit} onDelete={deleteDigit} activeColor={activeColor} />
          )}
          {desktop && (
            <Button type="text" icon={<MdKeyboard size={16} />} onClick={() => setShowCalc((c) => !c)} style={{ alignSelf: "flex-end", fontSize: "12px", color: "#8c8c8c", marginBottom: "8px" }}>
              {showCalc ? "Ocultar teclado" : "Mostrar teclado"}
            </Button>
          )}
          {/* Rubro buttons or single Agregar */}
          {usaRubro ? (
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              {visibleRubros.map((rubro) => (
                <button
                  key={rubro.sigla}
                  onClick={() => agregarItemConRubro(rubro)}
                  disabled={currentValue <= 0}
                  style={btnBase(currentValue <= 0)}
                >
                  <span style={{ fontSize: "15px", fontWeight: 800, lineHeight: 1 }}>{rubro.sigla}</span>
                  <span style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>{rubro.nombre}</span>
                </button>
              ))}
              <button
                onClick={() => { setEditItemId(null); setRubroModalOpen(true); }}
                disabled={currentValue <= 0}
                style={btnBase(currentValue <= 0)}
              >
                <span style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1 }}>+</span>
                <span style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>Más</span>
              </button>
            </div>
          ) : (
            <Button
              block
              disabled={currentValue <= 0}
              onClick={agregarItemSimple}
              style={{
                marginTop: "12px",
                height: "56px",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: 700,
                background: currentValue > 0 ? "#8c8c8c" : "#f0f0f0",
                borderColor: currentValue > 0 ? "#8c8c8c" : "#e8e8e8",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              AGREGAR +
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
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: `${activeColor}12`,
                        color: activeColor,
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1 }}>{item.rubro?.sigla || ""}</span>
                        <span style={{ fontSize: "8px", fontWeight: 600, lineHeight: 1, opacity: 0.8 }}>{item.rubro?.nombre || ""}</span>
                      </div>
                    ) : (
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: `${activeColor}12`,
                        color: activeColor,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: 800,
                      }}>
                        $
                      </div>
                    )}
                    <Text strong style={{ fontSize: "16px", color: "#262626" }}>$ {item.importe.toLocaleString("es-AR")}</Text>
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

          {/* BOTTOM STRIP + CONTINUAR */}
          <div style={{ marginTop: "16px", padding: "14px 20px", background: `${activeColor}0d`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${activeColor}18` }}>
            <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>{lineItems.length} {lineItems.length === 1 ? "item" : "items"}</Text>
            <Title level={4} style={{ margin: 0, color: activeColor, fontSize: "22px" }}>$ {total.toLocaleString("es-AR")}</Title>
          </div>

          <Button type="primary" block disabled={lineItems.length === 0} onClick={() => onNext({ importe: total, lineItems })} style={{ marginTop: "12px", height: "64px", backgroundColor: activeColor, borderColor: activeColor, borderRadius: "16px", fontSize: "19px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: lineItems.length > 0 ? `0 6px 20px ${activeColor}40` : "none", transition: "all 0.3s ease" }}>
            CONTINUAR <MdChevronRight size={28} style={{ marginLeft: "8px" }} />
          </Button>
        </>
      )}
    </div>
  );
};

export default StepImporte;
