import React, { useState } from "react";
import { Button, Row, Col, Tag, Typography } from "antd";
import { MdOutlineBackspace, MdChevronRight } from "react-icons/md";

const { Title } = Typography;

const StepImporte = ({ tipo, onNext }) => {
  const [valorCentavos, setValorCentavos] = useState(0);

  // Formato simple sin símbolos extra
  const formatNumber = (centavos) => {
    return (centavos / 100).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePress = (num) => {
    if (valorCentavos.toString().length >= 9) return;
    setValorCentavos((prev) => prev * 10 + parseInt(num));
  };

  const handleDelete = () => {
    setValorCentavos((prev) => Math.floor(prev / 10));
  };

  const colorMap = {
    Venta: "#1890ff",
    Pago: "#fa8c16",
    Retiro: "#546e7a",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER MINIMALISTA */}
      <div style={{ marginBottom: "8px" }}>
        <Tag
          color={colorMap[tipo]}
          style={{ borderRadius: "4px", fontWeight: "600" }}
        >
          {tipo.toUpperCase()}
        </Tag>
      </div>

      {/* VISOR: SOLO NÚMERO */}
      <div
        style={{
          textAlign: "right",
          padding: "10px 16px",
          background: "#fff",
          borderRadius: "8px",
          marginBottom: "8px",
          border: "1px solid #d9d9d9",
        }}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            fontSize: "52px",
            letterSpacing: "-1px",
            color: valorCentavos > 0 ? "#000" : "#bfbfbf",
          }}
        >
          {formatNumber(valorCentavos)}
        </Title>
      </div>

      {/* TECLADO COMPACTO */}
      <div style={{ flex: 1 }}>
        <Row gutter={[4, 4]}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"].map(
            (btn) => (
              <Col span={8} key={btn}>
                <Button
                  block
                  style={{
                    height: "62px",
                    fontSize: "24px",
                    borderRadius: "6px",
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                  }}
                  onClick={() => {
                    if (btn === "00") {
                      handlePress("0");
                      handlePress("0");
                    } else {
                      handlePress(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              </Col>
            ),
          )}
          <Col span={8}>
            <Button
              block
              type="text"
              danger
              style={{
                height: "62px",
                fontSize: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleDelete}
            >
              <MdOutlineBackspace />
            </Button>
          </Col>
        </Row>

        {/* BOTÓN SIGUIENTE ABAJO */}
        <Button
          type="primary"
          block
          size="large"
          disabled={valorCentavos === 0}
          onClick={() => onNext(valorCentavos / 100)}
          style={{
            marginTop: "12px",
            height: "56px",
            backgroundColor: colorMap[tipo],
            borderColor: colorMap[tipo],
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          SIGUIENTE <MdChevronRight size={22} />
        </Button>
      </div>
    </div>
  );
};

export default StepImporte;
