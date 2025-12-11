import React, { useMemo } from "react";
import { Card, Row, Col, Button, Typography } from "antd";

const { Title, Text } = Typography;

const format = (v) => {
  const n = Number(v) || 0;
  return Math.round(n * 100) / 100;
};

const ResumenCarrito = ({ data }) => {
  const resumen = useMemo(() => {
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      data.itemsCount !== undefined
    ) {
      const itemsCount = Number(data.itemsCount) || 0;
      const subtotal = format(data.subtotal);
      const descuentos = format(data.descuentos);
      const recargo = format(data.recargo);
      const total = format(subtotal - descuentos + recargo);
      return { itemsCount, subtotal, descuentos, recargo, total };
    }

    const items = Array.isArray(data) ? data : [];
    const itemsCount = items.length;
    const subtotal = format(
      items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0)
    );
    const descuentos = 0;
    const recargo = 0;
    const total = format(subtotal - descuentos + recargo);
    return { itemsCount, subtotal, descuentos, recargo, total };
  }, [data]);

  return (
    <Card
      style={{
        backgroundColor: "#f9f9f9",
        border: "none",
        borderRadius: "4px",
      }}
    >
      {/* TÍTULO CENTRADO */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: "#888",
            fontWeight: 500,
          }}
        >
          Resumen
        </Title>
      </Row>

      {/* FILA: Cant Items */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={12}>
          <Text>Cant Items</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Text>{resumen.itemsCount}</Text>
        </Col>
      </Row>

      {/* FILA: Subtotal */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={12}>
          <Text>Subtotal</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Text>${resumen.subtotal}</Text>
        </Col>
      </Row>

      {/* FILA: Descuentos */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={12}>
          <Text>Descuentos</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Text type="danger">-${resumen.descuentos}</Text>
        </Col>
      </Row>

      {/* FILA: Recargo */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={12}>
          <Text>Recargo</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Text>${resumen.recargo}</Text>
        </Col>
      </Row>

      {/* TOTAL */}
      <Row
        style={{
          borderTop: "1px solid #e8e8e8",
          paddingTop: 12,
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }}>
            Total
          </Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Title level={4} style={{ margin: 0 }}>
            ${resumen.total}
          </Title>
        </Col>
      </Row>

      <Button
        type="primary"
        size="large"
        style={{
          width: "100%",
          backgroundColor: "#40467b",
          borderColor: "#40467b",
        }}
      >
        PAGAR
      </Button>
    </Card>
  );
};

export default ResumenCarrito;
