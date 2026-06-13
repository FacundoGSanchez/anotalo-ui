import React from "react";
import { Button, Row, Col } from "antd";

const Calculadora = ({ onPress, onPlus, activeColor, hasValue, height = "64px" }) => {
  const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const btnStyle = {
    height,
    fontSize: "24px",
    borderRadius: "12px",
    background: "#fff",
    fontWeight: "500",
    border: "1px solid #f0f0f0",
    transition: "all 0.1s",
  };

  return (
    <Row gutter={[8, 8]}>
      {numeros.map((btn) => (
        <Col span={8} key={btn}>
          <Button
            block
            style={btnStyle}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPress(btn)}
          >
            {btn}
          </Button>
        </Col>
      ))}

      {/* Last row: 00 0 + */}
      <Col span={8}>
        <Button
          block
          style={btnStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPress("00")}
        >
          00
        </Button>
      </Col>
      <Col span={8}>
        <Button
          block
          style={btnStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPress("0")}
        >
          0
        </Button>
      </Col>
      <Col span={8}>
        <Button
          block
          disabled={!hasValue}
          style={{
            height,
            borderRadius: "12px",
            fontSize: "24px",
            fontWeight: "700",
            border: hasValue ? `2px solid ${activeColor}` : "1px solid #e8e8e8",
            background: hasValue ? activeColor : "#f5f5f5",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1.2,
            gap: 0,
            transition: "all 0.15s",
            cursor: hasValue ? "pointer" : "default",
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onPlus}
        >
          <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
          <span style={{ fontSize: "9px", fontWeight: 600, opacity: 0.9, lineHeight: 1 }}>AGREGAR</span>
        </Button>
      </Col>
    </Row>
  );
};

export default Calculadora;
