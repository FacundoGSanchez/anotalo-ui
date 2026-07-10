import React, { useState, useEffect, useCallback } from "react";
import { Modal, Typography } from "antd";

const { Text } = Typography;

const fmt = (v) => `${Number(v).toLocaleString("es-AR")}`;

const getFontSize = (val) => {
  const s = val.toString().length;
  if (s <= 5) return "30px";
  if (s <= 8) return "24px";
  return "18px";
};

const btnStyle = {
  flex: 1,
  height: "56px",
  fontSize: "24px",
  borderRadius: "12px",
  background: "#fff",
  fontWeight: "500",
  border: "1px solid #f0f0f0",
  transition: "all 0.1s",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const CalcMultipleFormaPago = ({ open, formaLabel, formaColor, initialValue = 0, importe = 0, saldo = 0, onConfirm, onCancel }) => {
  const [value, setValue] = useState(0);
  const asignado = importe - saldo;

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const maxValue = saldo + initialValue;

  const addDigit = useCallback((digit) => {
    setValue((prev) => {
      if (prev.toString().length >= 12) return prev;
      const candidate = prev * 10 + parseInt(digit, 10);
      return Math.min(candidate, maxValue);
    });
  }, [maxValue]);

  const clearValue = useCallback(() => {
    setValue(0);
  }, []);

  const handleBackspace = useCallback(() => {
    setValue((prev) => Math.floor(prev / 10));
  }, []);

  const handleConfirm = () => {
    onConfirm(value);
  };

  const handleCancel = () => {
    setValue(0);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      closable={true}
      maskClosable={true}
      destroyOnHidden
      width={340}
      style={{ maxWidth: "calc(100vw - 32px)" }}
      styles={{ body: { padding: "0 16px 16px" } }}
    >
      {/* Título */}
      <div style={{ textAlign: "center", marginBottom: "10px", marginTop: "8px" }}>
        <Text strong style={{ fontSize: "16px", color: formaColor }}>
          {formaLabel?.toUpperCase()}
        </Text>
      </div>

      {/* Leyenda en card con $ en margen izquierdo */}
      <div
        style={{
          display: "flex",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "12px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: "40px",
            minHeight: "100%",
            backgroundColor: formaColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Text style={{ fontSize: "18px", color: "#fff", fontWeight: 700 }}>
            $
          </Text>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 12px",
          }}
        >
          <div>
            <Text style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}>
              TOTAL
            </Text>
            <Text strong style={{ fontSize: "14px" }}>
              {fmt(importe)}
            </Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}>
              ASIGNADO
            </Text>
            <Text strong style={{ fontSize: "14px", color: "#52c41a" }}>
              {fmt(asignado)}
            </Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Text style={{ fontSize: "11px", color: "#8c8c8c", display: "block", fontWeight: 600 }}>
              SALDO
            </Text>
            <Text
              strong
              onClick={() => {
                if (saldo > 0) setValue(Math.min(saldo, maxValue));
              }}
              style={{
                fontSize: "14px",
                color: saldo === 0 ? "#52c41a" : "#faad14",
                cursor: saldo > 0 ? "pointer" : "default",
                textDecoration: saldo > 0 ? "underline dotted" : "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { if (saldo > 0) e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { if (saldo > 0) e.currentTarget.style.opacity = "1"; }}
            >
              {saldo === 0 ? "0" : fmt(saldo)}
            </Text>
          </div>
        </div>
      </div>

      {/* Visor — mismo look & feel que StepImporte */}
      <div
        style={{
          display: "flex",
          background: "#f8f9fa",
          borderRadius: "16px",
          marginBottom: "12px",
          height: "72px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "100%",
            backgroundColor: formaColor,
            transition: "background-color 0.3s ease",
          }}
        />
        <div
          style={{
            flex: 1,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "6px",
          }}
        >
          <Text
            style={{
              fontSize: "28px",
              color: formaColor,
              fontWeight: "600",
              lineHeight: 1,
            }}
          >
            $
          </Text>
          <Text
            style={{
              fontSize: getFontSize(value),
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: value > 0 ? "#000" : "#bfbfbf",
              lineHeight: 1,
              transition: "font-size 0.2s ease-in-out",
            }}
          >
            {fmt(value)}
          </Text>
        </div>
      </div>

      {/* Teclado numérico inline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]].map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: "8px" }}>
            {row.map((btn) => (
              <button
                key={btn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addDigit(btn)}
                style={btnStyle}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
        {/* Última fila: C | 0 | ⌫ */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearValue}
            style={btnStyle}
          >
            C
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => addDigit("0")}
            style={btnStyle}
          >
            0
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBackspace}
            style={btnStyle}
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Botón CONFIRMAR fuera del grid */}
      <button
        onClick={handleConfirm}
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 700,
          border: "none",
          background: formaColor,
          color: "#fff",
          cursor: "pointer",
          marginTop: "12px",
          transition: "all 0.15s",
          letterSpacing: "0.5px",
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        CONFIRMAR
      </button>
    </Modal>
  );
};

export default CalcMultipleFormaPago;
