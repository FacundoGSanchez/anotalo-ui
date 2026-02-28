import React from "react";
import { Typography, Button, Space } from "antd";
import { MdFilterList, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Aseguramos el idioma español

const { Title, Text } = Typography;

const HeaderMovimientos = ({ fecha, onOpenFiltros }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "20px",
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Movimientos
        </Title>
        <Text
          type="secondary"
          style={{
            color: "#1890ff",
            fontWeight: "600",
            textTransform: "capitalize", // Para que el día empiece en Mayúscula
            fontSize: "13px",
          }}
        >
          {/* Forzamos el locale 'es' antes de formatear */}
          {dayjs(fecha).locale("es").format("dddd, DD/MM/YYYY")}
        </Text>
      </div>

      <Space size={12}>
        {/* BOTÓN NUEVO MOVIMIENTO */}
        <Button
          type="primary"
          icon={<MdAdd size={20} />}
          onClick={() =>
            navigate("/pos/anotalo", { state: { from: "movimientos" } })
          } // <-- Agregamos el origen
          style={{ borderRadius: "8px", fontWeight: "600" }}
        >
          Nuevo
        </Button>

        {/* BOTÓN FILTRO */}
        <Button
          type="default"
          icon={<MdFilterList size={22} />}
          onClick={onOpenFiltros}
          style={{
            border: "1px solid #1890ff",
            color: "#1890ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Space>
    </div>
  );
};

export default HeaderMovimientos;
