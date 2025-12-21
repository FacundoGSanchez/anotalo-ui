import React, { useMemo } from "react";
import { Card, Row, Col, Button, Typography } from "antd";
import formatFloat from "../../components/formatFloat";
import "./pos.css";

const { Title, Text } = Typography;

const ResumenCarrito = ({ data }) => {
  const resumen = useMemo(() => {
    // Caso cuando llega como un objeto resumen
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      data.itemsCount !== undefined
    ) {
      const itemsCount = Number(data.itemsCount) || 0;

      const subtotal = formatFloat(data.subtotal);
      const descuentos = formatFloat(data.descuentos);
      const recargo = formatFloat(data.recargo);

      const total = formatFloat(
        Number(subtotal) - Number(descuentos) + Number(recargo)
      );

      return { itemsCount, subtotal, descuentos, recargo, total };
    }

    // Caso normal: array de items
    const items = Array.isArray(data) ? data : [];
    const itemsCount = items.length;

    const subtotal = formatFloat(
      items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0)
    );

    const descuentos = formatFloat(0);
    const recargo = formatFloat(0);

    const total = formatFloat(
      Number(subtotal) - Number(descuentos) + Number(recargo)
    );

    return { itemsCount, subtotal, descuentos, recargo, total };
  }, [data]);

  return (
    <Card className="resumen_card">
      <Row justify="center" className="resumen_row-title">
        <Title level={4} className="resumen_title">
          R e s u m e n
        </Title>
      </Row>

      <Row className="resumen_row">
        <Col span={12}>
          <Text className="resumen_label">Cant Items</Text>
        </Col>
        <Col span={12} className="resumen_value-col">
          <Text className="resumen_value">{resumen.itemsCount}</Text>
        </Col>
      </Row>

      <Row className="resumen_row">
        <Col span={12}>
          <Text className="resumen_label">Subtotal</Text>
        </Col>
        <Col span={12} className="resumen_value-col">
          <Text className="resumen_value">${resumen.subtotal}</Text>
        </Col>
      </Row>

      <Row className="resumen_row">
        <Col span={12}>
          <Text className="resumen_label">Descuentos</Text>
        </Col>
        <Col span={12} className="resumen_value-col">
          <Text className="resumen_value resumen_value-danger">
            -${resumen.descuentos}
          </Text>
        </Col>
      </Row>

      <Row className="resumen_row">
        <Col span={12}>
          <Text className="resumen_label">Recargo</Text>
        </Col>
        <Col span={12} className="resumen_value-col">
          <Text className="resumen_value">${resumen.recargo}</Text>
        </Col>
      </Row>

      <Row className="resumen_total-row">
        <Col span={12}>
          <Title level={4} className="resumen_total-title">
            Total
          </Title>
        </Col>
        <Col span={12} className="resumen_value-col">
          <Title level={4} className="resumen_total-title">
            ${resumen.total}
          </Title>
        </Col>
      </Row>

      <Button type="primary" size="large" className="resumen_btn">
        PAGAR
      </Button>
    </Card>
  );
};

export default ResumenCarrito;
