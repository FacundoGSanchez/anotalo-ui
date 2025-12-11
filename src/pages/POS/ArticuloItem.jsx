import React, { useState } from "react";
import { Row, Col, Button, Typography, InputNumber } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ArticuloItem = ({
  id,
  detalle,
  codigo,
  precio,
  cantidad,
  subtotal,
  difPeso = 0,
  onDelete,
  onUpdate,
}) => {
  const [difP] = useState(difPeso);
  const [cant, setCant] = useState(cantidad);

  const calcularSubtotal = (vDifPeso, vCant) =>
    Number(((precio + vDifPeso) * vCant).toFixed(2));

  const handleCantidad = (v) => {
    const val = Number(v) || 1;
    setCant(val);
  };

  const handleBlur = () => {
    const newSubtotal = calcularSubtotal(difP, cant);
    onUpdate(id, {
      difPeso: difP,
      cantidad: cant,
      subtotal: newSubtotal,
    });
  };

  const colorDif = difP < 0 ? "#00aa55" : difP > 0 ? "#0077cc" : "#000000";

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      style={{
        padding: "10px 0",
        borderBottom: "1px solid #efefef",
        width: "100%",
        textAlign: "center",
      }}
    >
      <Col xs={24} md={8} style={{ textAlign: "left" }}>
        <Text strong>{detalle}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: "0.75rem" }}>
          Código: {codigo}
        </Text>
      </Col>

      <Col xs={6} md={4} style={{ textAlign: "right" }}>
        <Text>${precio}</Text>
      </Col>

      <Col xs={6} md={4}>
        <Text strong style={{ color: colorDif }}>
          ${difP}
        </Text>
      </Col>

      <Col xs={6} md={2}>
        <InputNumber
          min={1}
          value={cant}
          onChange={handleCantidad}
          onBlur={handleBlur}
          style={{ width: "100%", textAlign: "right" }}
        />
      </Col>

      <Col xs={6} md={4} style={{ textAlign: "right" }}>
        <Text strong>${subtotal}</Text>
      </Col>

      <Col
        xs={24}
        md={1}
        style={{
          display: "flex",
          justifyContent: "space-between", // espaciado uniforme
          alignItems: "center", // centrado vertical
          gap: "6px", // separación opcional extra
        }}
      >
        <Button
          icon={<DeleteOutlined />}
          type="text"
          danger
          size="small"
          onClick={() => onDelete(id)}
        />

        <Button
          icon={<MoreOutlined />}
          type="text"
          size="small"
          onClick={() => onEdit(id)}
        />
      </Col>
    </Row>
  );
};

export default ArticuloItem;
