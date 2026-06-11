import React from "react";
import { Card, Typography, Tag } from "antd";
import { MdListAlt, MdAccountBalance, MdAssignment, MdBarChart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const REPORTES = [
  {
    key: "movimientos",
    icon: <MdListAlt />,
    label: "Movimientos",
    route: "/movimientos",
    color: "#1890ff",
    futuro: false,
  },
  {
    key: "saldo-ctas-ctes",
    icon: <MdAccountBalance />,
    label: "Saldo Ctas Ctes",
    route: "/reportes/saldo-ctas-ctes",
    color: "#eb2f96",
    futuro: true,
  },
  {
    key: "pedidos",
    icon: <MdAssignment />,
    label: "Pedidos",
    route: "/pedidos",
    color: "#fa8c16",
    futuro: true,
  },
  {
    key: "resumen-ventas",
    icon: <MdBarChart />,
    label: "Resumen Ventas",
    route: "/reportes/resumen-ventas",
    color: "#52c41a",
    futuro: true,
  },
];

const AccesoReportesNuevo = () => {
  const navigate = useNavigate();

  return (
    <Card
      title={<Text strong style={{ fontSize: "16px" }}>Reportes</Text>}
      style={{
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
      }}
      styles={{ body: { padding: "12px 12px" } }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
        className="no-scrollbar"
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {REPORTES.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.route)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              minWidth: "100px",
              flexShrink: 0,
              flex: 1,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                color: item.color,
                background: `${item.color}12`,
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px auto",
                opacity: item.futuro ? 0.6 : 1,
              }}
            >
              {item.icon}
            </div>
            <Text
              strong
              style={{ fontSize: "12px", display: "block", color: "#595959", opacity: item.futuro ? 0.6 : 1 }}
            >
              {item.label}
            </Text>
            {item.futuro && (
              <Tag
                color="default"
                style={{
                  fontSize: "8px",
                  lineHeight: "14px",
                  padding: "0 4px",
                  margin: "2px 0 0",
                  borderRadius: "4px",
                }}
              >
                Próximamente
              </Tag>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AccesoReportesNuevo;
