import React from "react";
import { Row, Col, Button, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ArticuloItem = ({ detalle, codigo, precio, dif, cant, subtotal }) => (
  <Row
    gutter={[8, 8]}
    align="middle"
    style={{
      padding: "12px 0",
      borderBottom: "1px solid #f0f0f0",
      width: "100%",
    }}
  >
    {/* Columna Detalle */}
    <Col xs={24} md={8}>
      <Text strong>{detalle}</Text>
      <br />
      <Text type="secondary" style={{ fontSize: "0.75rem" }}>
        Código: {codigo}
      </Text>
    </Col>

    {/* Columnas de Valores */}
    <Col xs={6} md={4} style={{ textAlign: "right" }}>
      <Text>${precio}</Text>
    </Col>
    <Col xs={6} md={4} style={{ textAlign: "right" }}>
      <Text type="danger">-${dif}</Text>
    </Col>
    <Col xs={6} md={3} style={{ textAlign: "center" }}>
      <Text>{cant}</Text>
    </Col>
    <Col xs={6} md={3} style={{ textAlign: "right" }}>
      <Text strong>${subtotal}</Text>
    </Col>

    {/* Botón de eliminar */}
    <Col xs={24} md={2} style={{ textAlign: "center" }}>
      <Button
        icon={<DeleteOutlined />}
        type="text"
        danger
        size="small" /* onClick={handleDelete} */
      />
    </Col>
  </Row>
);

export default ArticuloItem;
