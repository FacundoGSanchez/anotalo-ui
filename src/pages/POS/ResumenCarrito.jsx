import React, { useMemo } from "react";
import { Card, Row, Button, Typography } from "antd";

const { Title, Text } = Typography;

const format = (v) => {
  const n = Number(v) || 0;
  // formateo simple (sin Intl para evitar depender del locale)
  return Math.round(n * 100) / 100;
};

const ResumenCarrito = ({ data }) => {
  const resumen = useMemo(() => {
    // Caso 1: te pasaron directamente el objeto resumen { itemsCount, subtotal, ... }
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

    // Caso 2: te pasaron la lista de items (array) o data viene vacío
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
      <Row>
        <Text strong style={{ display: "block", marginBottom: 16 }}>
          Cant Item x {resumen.itemsCount}
        </Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: 4 }}>
        <Text>Subtotal</Text>
        <Text>${resumen.subtotal}</Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: 4 }}>
        <Text>Descuentos</Text>
        <Text type="danger">-${resumen.descuentos}</Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: 4 }}>
        <Text>Recargo</Text>
        <Text>${resumen.recargo}</Text>
      </Row>

      <Row
        justify="space-between"
        style={{
          borderTop: "1px solid #e8e8e8",
          paddingTop: 16,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          ${resumen.total}
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
      >
        PAGAR
      </Button>
    </Card>
  );
};

export default ResumenCarrito;
