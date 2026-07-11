import { useState } from "react";
import { Typography, Button, Row, Col, InputNumber, Input } from "antd";
import { useDevice } from "../context/DeviceContext";

const { Text } = Typography;

const BOTONES_TECLADO = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "\u232b", "0", "C"];

const CalculadoraGestion = ({
  value,
  onChange,
  accentColor = "#52c41a",
  title = null,
  titleColor,
  titleBg,
  titleBorder,
  buttonLabel = "Continuar",
  onConfirm,
  disabled,
  showObservacion = false,
  observacion = "",
  onObservacionChange,
  compact = false,
}) => {
  const { isDesktop } = useDevice();
  const [editBuffer, setEditBuffer] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const btnHeight = compact ? "38px" : "48px";
  const btnFontSize = compact ? "18px" : "22px";
  const btnBorderRadius = compact ? "8px" : "12px";
  const visorHeight = compact ? "44px" : "56px";
  const visorFontSize = compact ? "24px" : "28px";
  const visorFontSizeEmpty = compact ? "18px" : "22px";
  const visorPadding = compact ? "4px 12px" : "8px 16px";
  const visorMarginBottom = compact ? "6px" : "0";
  const gutter = compact ? [4, 4] : [6, 6];
  const resolvedTitleColor = titleColor || accentColor;
  const resolvedDisabled = disabled !== undefined ? disabled : value <= 0;

  const handlePressTecla = (val) => {
    const setVal = isEditing ? setEditBuffer : onChange;
    const current = isEditing ? editBuffer : value;

    if (val === "\u232b") {
      setVal(Math.floor(current / 10));
      return;
    }
    if (val === "C") {
      setVal(0);
      return;
    }
    if (current.toString().length >= 12) return;
    setVal(current * 10 + parseInt(val, 10));
  };

  const handleDesktopChange = (val) => {
    onChange(val || 0);
  };

  const handleSaveCompact = () => {
    if (editBuffer <= 0) return;
    onChange(editBuffer);
    setIsEditing(false);
  };

  const handleCancelCompact = () => {
    setIsEditing(false);
    setEditBuffer(0);
  };

  const handleStartEdit = () => {
    setEditBuffer(value);
    setIsEditing(true);
  };

  if (compact) {
    return (
      <div>
        {isEditing ? (
          <div style={{ marginTop: "4px" }}>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: visorPadding,
                height: visorHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                border: "1px solid #f0f0f0",
                marginBottom: visorMarginBottom,
              }}
            >
              <Text
                strong
                style={{
                  fontSize: editBuffer > 0 ? visorFontSize : visorFontSizeEmpty,
                  color: editBuffer > 0 ? "#262626" : "#bfbfbf",
                }}
              >
                $ {(editBuffer > 0 ? editBuffer : value).toLocaleString("es-AR")}
              </Text>
            </div>
            <Row gutter={gutter}>
              {BOTONES_TECLADO.map((btn) => (
                <Col span={8} key={btn}>
                  <Button
                    block
                    style={{
                      height: btnHeight,
                      fontSize: btnFontSize,
                      borderRadius: btnBorderRadius,
                      background: "#fff",
                      border: "1px solid #f0f0f0",
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePressTecla(btn)}
                  >
                    {btn}
                  </Button>
                </Col>
              ))}
            </Row>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <Button
                type="primary"
                size="small"
                disabled={editBuffer <= 0}
                onClick={handleSaveCompact}
                style={{
                  flex: 1,
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: accentColor,
                  borderColor: accentColor,
                }}
              >
                Guardar
              </Button>
              <Button
                size="small"
                onClick={handleCancelCompact}
                style={{ flex: 1, borderRadius: "8px", fontSize: "12px" }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="link"
            size="small"
            onClick={handleStartEdit}
            style={{ padding: 0, height: "auto", fontSize: "12px" }}
          >
            Editar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "8px",
      }}
    >
      {title && (
        <div
          style={{
            textAlign: "center",
            padding: "8px",
            background: titleBg || "transparent",
            borderRadius: "8px",
            border: titleBorder ? `1px solid ${titleBorder}` : "none",
          }}
        >
          <Text style={{ fontSize: "12px", color: resolvedTitleColor }}>
            {title}
          </Text>
        </div>
      )}

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: visorPadding,
          height: visorHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          border: "1px solid #f0f0f0",
        }}
      >
        <Text
          strong
          style={{
            fontSize: value > 0 ? visorFontSize : visorFontSizeEmpty,
            color: value > 0 ? "#262626" : "#bfbfbf",
            letterSpacing: "-1px",
          }}
        >
          $ {value.toLocaleString("es-AR")}
        </Text>
      </div>

      {isDesktop ? (
        <InputNumber
          value={value}
          onChange={handleDesktopChange}
          style={{
            width: "100%",
            height: btnHeight,
            borderRadius: "12px",
            fontSize: "18px",
          }}
          formatter={(v) => `$ ${v}`}
          parser={(v) => v.replace(/[$\s]/g, "")}
          min={0}
          max={999999999999}
          autoFocus
        />
      ) : (
        <Row gutter={gutter}>
          {BOTONES_TECLADO.map((btn) => (
            <Col span={8} key={btn}>
              <Button
                block
                style={{
                  height: btnHeight,
                  fontSize: btnFontSize,
                  borderRadius: btnBorderRadius,
                  background: "#fff",
                  fontWeight: 500,
                  border: "1px solid #f0f0f0",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePressTecla(btn)}
              >
                {btn}
              </Button>
            </Col>
          ))}
        </Row>
      )}

      {showObservacion && (
        <Input.TextArea
          placeholder="Observación (opcional)"
          value={observacion}
          onChange={(e) => onObservacionChange?.(e.target.value)}
          rows={2}
          style={{ borderRadius: "8px", resize: "none" }}
        />
      )}

      <Button
        type="primary"
        block
        size="large"
        disabled={resolvedDisabled}
        onClick={onConfirm}
        style={{
          marginTop: "4px",
          height: "48px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 700,
          background: accentColor,
          borderColor: accentColor,
        }}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default CalculadoraGestion;
