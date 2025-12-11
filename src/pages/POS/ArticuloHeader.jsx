// ArticuloHeader.jsx
import { Row, Col } from "antd";

const ArticuloHeader = () => (
  <Row
    gutter={[8, 8]}
    style={{
      fontWeight: "bold",
      backgroundColor: "#f5f5f5",
      padding: "8px 0",
      borderBottom: "1px solid #e8e8e8",
      textAlign: "center",
    }}
  >
    <Col md={8} style={{ textAlign: "left" }}>
      Detalle
    </Col>
    <Col md={4} style={{ textAlign: "right" }}>
      Precio
    </Col>
    <Col md={4}>Dif</Col>
    <Col md={2}>Cant</Col>
    <Col md={4} style={{ textAlign: "right" }}>
      Subtotal
    </Col>
    <Col md={1}></Col>
  </Row>
);

export default ArticuloHeader;
