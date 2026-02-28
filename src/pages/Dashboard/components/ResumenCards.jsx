import React from "react";
import { Card, Typography, Space } from "antd";

const { Text, Title } = Typography;

const ResumenCard = ({ title, amount, color }) => (
  <Card
    style={{
      minWidth: "150px",
      borderRadius: "16px",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
    styles={{
      body: {
        padding: "16px",
        borderLeft: `5px solid ${color}`,
        borderRadius: "16px",
      },
    }}
  >
    <Space direction="vertical" size={0}>
      <Text type="secondary" style={{ fontSize: "12px", fontWeight: "600" }}>
        {title.toUpperCase()}
      </Text>
      <Title level={4} style={{ margin: 0, fontSize: "20px" }}>
        ${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </Title>
    </Space>
  </Card>
);

const ResumenCards = ({ totales }) => (
  <div
    style={{
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      padding: "4px 0 16px 0",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}
  >
    <ResumenCard title="Ventas" amount={totales.ventas} color="#52c41a" />
    <ResumenCard title="Pagos" amount={totales.pagos} color="#ff4d4f" />
    <ResumenCard title="Retiros" amount={totales.retiros} color="#fa8c16" />
  </div>
);

export default ResumenCards;
