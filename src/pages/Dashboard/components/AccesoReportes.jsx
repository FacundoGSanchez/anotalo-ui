import React from "react";
import { Card, Typography } from "antd";
import { MdAttachMoney, MdOutlineContactPage } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const REPORTES = [
  {
    key: "caja",
    icon: <MdAttachMoney />,
    label: "Caja",
    route: "/reportes/caja",
    color: "#52c41a",
  },
  {
    key: "ctacte",
    icon: <MdOutlineContactPage />,
    label: "Cta Corriente",
    route: "/reportes/ctacte",
    color: "#eb2f96",
  },
];

const AccesoReportes = () => {
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
        {REPORTES.map((rep) => (
          <div
            key={rep.key}
            onClick={() => navigate(rep.route)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              minWidth: "100px",
              flexShrink: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "22px",
                color: rep.color,
                background: `${rep.color}12`,
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px auto",
              }}
            >
              {rep.icon}
            </div>
            <Text
              strong
              style={{ fontSize: "12px", display: "block", color: "#595959" }}
            >
              {rep.label}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AccesoReportes;
