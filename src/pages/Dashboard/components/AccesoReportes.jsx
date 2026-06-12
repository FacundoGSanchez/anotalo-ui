import React from "react";
import { Card, Typography } from "antd";
import { MdAttachMoney, MdOutlineContactPage, MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const GESTIONES = [
  {
    key: "caja",
    icon: <MdAttachMoney />,
    label: "Admin Caja",
    route: "/gestiones/caja",
    color: "#52c41a",
  },
  {
    key: "ctacte",
    icon: <MdOutlineContactPage />,
    label: "Cta Corriente",
    route: "/gestiones/ctacte",
    color: "#eb2f96",
  },
  {
    key: "compras",
    icon: <MdShoppingCart />,
    label: "Compras",
    route: "/compras",
    color: "#fa8c16",
  },
];

const AccesoReportes = () => {
  const navigate = useNavigate();

  return (
    <Card
      title={<Text strong style={{ fontSize: "16px" }}>Gestiones</Text>}
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
        {GESTIONES.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.route)}
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
                color: item.color,
                background: `${item.color}12`,
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px auto",
              }}
            >
              {item.icon}
            </div>
            <Text
              strong
              style={{ fontSize: "12px", display: "block", color: "#595959" }}
            >
              {item.label}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AccesoReportes;
