import React from "react";
import { Card, Row, Button, Typography } from "antd";

const { Title, Text } = Typography;

const ResumenCarrito = ({ data }) => {
  return (
    <Card
      style={{
        backgroundColor: "#f9f9f9",
        border: "none",
        borderRadius: "4px",
      }}
    >
      <Row>
        <Text strong style={{ display: "block", marginBottom: "16px" }}>
          Cant Item x {data.itemsCount}
        </Text>
      </Row>
      <Row justify="space-between" style={{ marginBottom: "4px" }}>
        <Text>Subtotal</Text>
        <Text>${data.subtotal}</Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: "4px" }}>
        <Text>Descuentos</Text>
        <Text type="danger">-${data.descuentos}</Text>
      </Row>
      <Row justify="space-between" style={{ marginBottom: "4px" }}>
        <Text>Recargo</Text>
        <Text>${data.recargo}</Text>
      </Row>
      {/* Total y Botón de Pagar */}
      <Row
        justify="space-between"
        style={{
          borderTop: "1px solid #e8e8e8",
          paddingTop: "16px",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          ${data.total}
        </Title>
      </Row>

      <Button
        type="primary"
        size="large"
        style={{
          width: "100%",
          backgroundColor: "#40467b",
          borderColor: "#40467b",
        }}
        /* onClick={handlePagar} */
      >
        PAGAR
      </Button>
    </Card>
  );
};

export default ResumenCarrito;
