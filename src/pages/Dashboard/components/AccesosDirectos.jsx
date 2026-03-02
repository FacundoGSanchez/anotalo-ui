import React from "react";
import { Card, Typography } from "antd";
import { OPCIONES_TIPO, POS_COLORS } from "../../../constants/posConstants";

const { Text } = Typography;

const AccesoBtn = ({ icon, label, color, onClick }) => (
  <div
    onClick={onClick}
    style={{
      textAlign: "center",
      cursor: "pointer",
      minWidth: "75px",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        fontSize: "26px",
        color: color,
        background: `${color}12`,
        maxWidth: "56px",
        height: "56px",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px auto",
        boxShadow: `0 4px 10px ${color}15`,
      }}
    >
      {icon}
    </div>
    <Text
      strong
      style={{ fontSize: "11px", display: "block", color: "#595959" }}
    >
      {label.toUpperCase()}
    </Text>
  </div>
);

const AccesosDirectos = ({ onSelectTipo }) => {
  return (
    <Card
      title={<Text strong>Accesos Rápidos</Text>}
      style={{
        borderRadius: "20px",
        marginBottom: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
      }}
      styles={{ body: { padding: "12px 10px" } }}
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "6px",
          paddingBottom: "8px",
        }}
        className="no-scrollbar"
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {OPCIONES_TIPO.map((opt) => (
          <AccesoBtn
            key={opt.key}
            icon={opt.icon}
            label={opt.key}
            color={POS_COLORS[opt.key]}
            onClick={() => onSelectTipo(opt.key)}
          />
        ))}
      </div>
    </Card>
  );
};

export default AccesosDirectos;
