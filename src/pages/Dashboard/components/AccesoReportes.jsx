import React from "react";
import { Card, Typography } from "antd";
import { MdAttachMoney, MdOutlineContactPage, MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useMovimientoSession } from "../../../context/MovimientoSessionContext";

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
    icon: <MdPayment />,
    label: "Pago Proveedor",
    route: "/compras",
    color: "#fa8c16",
  },
];

const AccesoReportes = () => {
  const navigate = useNavigate();
  const { hasActiveItems, confirmExit } = useMovimientoSession();

  const handleNavigate = (route) => {
    if (hasActiveItems) {
      confirmExit(route, navigate);
    } else {
      navigate(route);
    }
  };

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
          flexWrap: "wrap",
          gap: "12px",
          paddingBottom: "4px",
          justifyContent: "space-around",
        }}
      >
        {GESTIONES.map((item) => (
          <div
            key={item.key}
            onClick={() => handleNavigate(item.route)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              flex: "1 0 0",
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
              style={{
                fontSize: "12px",
                display: "block",
                color: "#595959",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
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
