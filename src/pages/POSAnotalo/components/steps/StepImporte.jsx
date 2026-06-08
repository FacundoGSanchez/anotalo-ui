import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Typography, Input } from "antd";
import { MdChevronRight, MdKeyboard } from "react-icons/md";
import { VISOR_CONFIG, POS_COLORS } from "../../../../constants/posConstants";
import Calculadora from "./components/Calculadora";

const { Title, Text } = Typography;

const StepImporte = ({ tipo, onNext, desktop }) => {
  const [importe, setImporte] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const inputRef = useRef(null);

  const activeColor = POS_COLORS[tipo] || POS_COLORS.DEFAULT;

  const getFontSize = () => {
    const largo = importe.toLocaleString("es-AR").length;
    if (largo > 9) return VISOR_CONFIG.SIZES.SMALL;
    if (largo > 7) return VISOR_CONFIG.SIZES.MEDIUM;
    return VISOR_CONFIG.SIZES.DEFAULT;
  };

  const addDigit = useCallback((val) => {
    setImporte((prev) => {
      if (prev.toString().length >= VISOR_CONFIG.MAX_DIGITOS) return prev;
      if (val === "00") return prev * 100;
      return prev * 10 + parseInt(val);
    });
  }, []);

  const deleteDigit = useCallback(() => {
    setImporte((prev) => Math.floor(prev / 10));
  }, []);

  // Handle input change for desktop visible input
  const handleInputChange = useCallback((e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    setImporte(num);
  }, []);

  // Handle Enter key on the desktop input
  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && importe > 0) {
        onNext(importe);
      }
    },
    [importe, onNext],
  );

  // Desktop: auto-focus the input on mount
  useEffect(() => {
    if (desktop) {
      inputRef.current?.focus();
    }
  }, [desktop]);

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
              value={importe > 0 ? importe.toLocaleString("es-AR") : ""}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="0"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: getFontSize(),
                fontWeight: 700,
                textAlign: "right",
                outline: "none",
                color: importe > 0 ? "#000" : "#bfbfbf",
                letterSpacing: "-1px",
                fontFamily: "inherit",
              }}
            />
          ) : (
            <Title
              level={1}
              style={{
                margin: 0,
                fontSize: getFontSize(),
                letterSpacing: "-1.5px",
                color: importe > 0 ? "#000" : "#bfbfbf",
                lineHeight: 1,
                transition: "font-size 0.2s ease-in-out",
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              {importe.toLocaleString("es-AR")}
            </Title>
          )}
        </div>
      </div>

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

      {/* CALCULADORA — always visible on mobile, toggled on desktop */}
      {(desktop ? showCalc : true) && (
        <Calculadora
          onPress={addDigit}
          onDelete={deleteDigit}
          activeColor={activeColor}
        />
      )}

      {/* BOTÓN CONTINUAR */}
      <Button
        type="primary"
        block
        disabled={importe === 0}
        onClick={() => onNext(importe)}
        style={{
          marginTop: "20px",
          height: "64px",
          backgroundColor: activeColor,
          borderColor: activeColor,
          borderRadius: "16px",
          fontSize: "19px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: importe > 0 ? `0 6px 20px ${activeColor}40` : "none",
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
          Escribí el importe con el teclado físico
        </Text>
      )}
    </div>
  );
};

export default StepImporte;
