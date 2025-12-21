// ArticuloHeader.jsx
import { Row, Col } from "antd";
import "./pos.css";

const ArticuloHeader = () => (
  <Row gutter={[8, 8]} className="header_row">
    <Col md={8} className="header_col-left">
      Detalle
    </Col>

    <Col md={4} className="header_col-right">
      Precio
    </Col>

    <Col md={4} className="header_col-center">
      Dif
    </Col>

    <Col md={2} className="header_col-center">
      Cant
    </Col>

    <Col md={4} className="header_col-right">
      Subtotal
    </Col>

    <Col md={1}></Col>
  </Row>
);

export default ArticuloHeader;
