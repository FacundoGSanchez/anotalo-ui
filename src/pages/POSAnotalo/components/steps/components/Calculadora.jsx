import React from "react";
import { Button, Row, Col } from "antd";
import { MdOutlineBackspace } from "react-icons/md";

const Calculadora = ({ onPress, onDelete, activeColor, height = "64px" }) => {
  const botones = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"];

  return (
    <Row gutter={[8, 8]}>
      {botones.map((btn) => (
        <Col span={8} key={btn}>
          <Button
            block
            style={{
              height: height,
              fontSize: "24px",
              borderRadius: "12px",
              background: "#fff",
              fontWeight: "500",
              border: "1px solid #f0f0f0",
              transition: "all 0.1s",
            }}
            onMouseDown={(e) => e.preventDefault()} // Evita pérdida de foco en inputs si los hubiera
            onClick={() => onPress(btn)}
          >
            {btn}
          </Button>
        </Col>
      ))}
      <Col span={8}>
        <Button
          block
          type="text"
          danger
          style={{
            height: height,
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onDelete}
        >
          <MdOutlineBackspace />
        </Button>
      </Col>
    </Row>
  );
};

export default Calculadora;
