import React, { useState } from "react";
import { Row, Col, Button, Typography, InputNumber } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import formatFloat from "../../components/formatFloat";
import "./pos.css";

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
    <Row gutter={[8, 8]} align="middle" className="item_row">
      {/* Detalle + Código */}
      <Col xs={24} md={8} className="item_col-left">
        <Text strong>{detalle}</Text>
        <br />
        <Text type="secondary" className="item_codigo">
          Código: {codigo}
        </Text>
      </Col>

      {/* Precio */}
      <Col xs={6} md={4} className="item_col-right">
        <Text>${formatFloat(precio)}</Text>
      </Col>

      {/* Dif. Peso */}
      <Col xs={6} md={4} className="item_col-center">
        <Text strong style={{ color: colorDif }}>
          ${formatFloat(difP)}
        </Text>
      </Col>

      {/* Cantidad */}
      <Col xs={6} md={3}>
        <InputNumber
          min={1}
          value={cant}
          onChange={handleCantidad}
          onBlur={handleBlur}
          className="item_input-cant"
        />
      </Col>

      {/* Subtotal */}
      <Col xs={6} md={4} className="item_col-right">
        <Text strong>${formatFloat(subtotal)}</Text>
      </Col>

      {/* Botones */}
      <Col xs={24} md={1} className="item_actions">
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
          onClick={() => console.log("edit", id)}
        />
      </Col>
    </Row>
  );
};

export default ArticuloItem;
