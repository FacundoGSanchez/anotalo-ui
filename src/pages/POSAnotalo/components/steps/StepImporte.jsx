import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Typography } from "antd";
import { MdChevronRight, MdKeyboard, MdClose, MdAdd } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import Calculadora from "./components/Calculadora";

const { Title, Text } = Typography;

const StepImporte = ({ tipo, onNext, desktop, initialLineItems = [] }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [showCalc, setShowCalc] = useState(false);
  const [activeTab, setActiveTab] = useState("calc");
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

  const agregarItem = useCallback(() => {
    if (currentValue <= 0) return;
    setLineItems((prev) => [...prev, { id: Date.now(), importe: currentValue }]);
    setCurrentValue(0);
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [currentValue, desktop]);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && currentValue > 0) {
        agregarItem();
      }
    },
    [currentValue, agregarItem],
  );

  const eliminarItem = useCallback((id) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* VISOR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "12px",
          height: desktop ? "80px" : "88px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "100%",
            backgroundColor: activeColor,
            transition: "background-color 0.3s ease",
          }}
        />
        <div
          style={{
            flex: 1,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: "28px",
              color: activeColor,
              fontWeight: "600",
              marginRight: "10px",
            }}
          >
            $
          </Text>

          {desktop ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={currentValue > 0 ? currentValue.toLocaleString("es-AR") : ""}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="0"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: getFontSize(currentValue),
                fontWeight: 700,
                textAlign: "right",
                outline: "none",
                color: currentValue > 0 ? "#000" : "#bfbfbf",
                letterSpacing: "-1px",
                fontFamily: "inherit",
              }}
            />
          ) : (
            <Title
              level={1}
              style={{
                margin: 0,
                fontSize: getFontSize(currentValue),
                letterSpacing: "-1.5px",
                color: currentValue > 0 ? "#000" : "#bfbfbf",
                lineHeight: 1,
                transition: "font-size 0.2s ease-in-out",
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              {currentValue.toLocaleString("es-AR")}
            </Title>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("calc")}
          style={tabStyle(activeTab === "calc")}
        >
          Calculadora
        </button>
        <button
          onClick={() => setActiveTab("list")}
          style={tabStyle(activeTab === "list")}
        >
          Listado {lineItems.length > 0 && `(${lineItems.length})`}
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "calc" ? (
        <>
          {/* CALCULADORA — always visible on mobile, toggled on desktop */}
          {(desktop ? showCalc : true) && (
            <Calculadora
              onPress={addDigit}
              onDelete={deleteDigit}
              activeColor={activeColor}
            />
          )}

          {/* Desktop: toggle calculator button */}
          {desktop && (
            <Button
              type="text"
              icon={<MdKeyboard size={16} />}
              onClick={() => setShowCalc((c) => !c)}
              style={{
                alignSelf: "flex-end",
                fontSize: "12px",
                color: "#8c8c8c",
                marginBottom: "8px",
              }}
            >
              {showCalc ? "Ocultar teclado" : "Mostrar teclado"}
            </Button>
          )}

          {/* BOTÓN AGREGAR */}
          <Button
            type="default"
            block
            disabled={currentValue === 0}
            onClick={agregarItem}
            icon={<MdAdd size={20} />}
            style={{
              marginTop: "12px",
              height: "56px",
              borderRadius: "16px",
              fontSize: "17px",
              fontWeight: "bold",
              borderColor: activeColor,
              color: activeColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            AGREGAR
          </Button>
        </>
      ) : (
        <>
          {/* LISTA DE ITEMS */}
          {lineItems.length > 0 ? (
            <div
              style={{
                background: "#fafafa",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                padding: "12px 16px",
              }}
            >
              {lineItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom:
                      idx < lineItems.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <Text strong style={{ fontSize: "16px", color: "#262626" }}>
                    $ {item.importe.toLocaleString("es-AR")}
                  </Text>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MdClose size={16} />}
                    onClick={() => eliminarItem(item.id)}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <Text type="secondary" style={{ fontSize: "14px" }}>
                No hay items cargados
              </Text>
              <br />
              <Text
                type="secondary"
                style={{ fontSize: "12px", color: "#bfbfbf" }}
              >
                Usá la calculadora para agregar montos
              </Text>
            </div>
          )}
        </>
      )}

      {/* BOTTOM STRIP — count + total */}
      <div
        style={{
          marginTop: "16px",
          padding: "14px 20px",
          background: `${activeColor}0d`,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: `1px solid ${activeColor}18`,
        }}
      >
        <Text
          strong
          style={{
            fontSize: "14px",
            color: "#8c8c8c",
          }}
        >
          {lineItems.length} {lineItems.length === 1 ? "item" : "items"}
        </Text>
        <Title
          level={4}
          style={{
            margin: 0,
            color: activeColor,
            fontSize: "22px",
          }}
        >
          $ {total.toLocaleString("es-AR")}
        </Title>
      </div>

      {/* BOTÓN CONTINUAR */}
      <Button
        type="primary"
        block
        disabled={lineItems.length === 0}
        onClick={() => onNext({ importe: total, lineItems })}
        style={{
          marginTop: "12px",
          height: "64px",
          backgroundColor: activeColor,
          borderColor: activeColor,
          borderRadius: "16px",
          fontSize: "19px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            lineItems.length > 0
              ? `0 6px 20px ${activeColor}40`
              : "none",
          transition: "all 0.3s ease",
        }}
      >
        CONTINUAR <MdChevronRight size={28} style={{ marginLeft: "8px" }} />
      </Button>

      <Text
        type="secondary"
        style={{
          textAlign: "center",
          marginTop: "12px",
          fontSize: "11px",
          letterSpacing: "0.5px",
          fontWeight: "700",
        }}
      >
        PASO 2 DE 4 | INGRESAR IMPORTE
      </Text>
      {desktop && (
        <Text
          type="secondary"
          style={{
            textAlign: "center",
            marginTop: "4px",
            fontSize: "10px",
            color: "#bfbfbf",
          }}
        >
          Escribí el importe con el teclado físico y presioná Enter para agregar
        </Text>
      )}
    </div>
  );
};

export default StepImporte;
