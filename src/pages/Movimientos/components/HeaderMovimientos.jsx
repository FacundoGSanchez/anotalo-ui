import React from "react";
import { Typography, Button, Space } from "antd";
import { MdFilterList, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const HeaderMovimientos = ({ onOpenFiltros }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Movimientos
        </Title>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Últimos registros de caja
        </Text>
      </div>

      <Space size={12}>
        <Button
          type="primary"
          icon={<MdAdd size={20} />}
          onClick={() =>
            navigate("/pos/anotalo", { state: { from: "movimientos" } })
          }
          style={{ borderRadius: "8px", fontWeight: "600" }}
        >
          Nuevo
        </Button>

        <Button
          type="default"
          icon={<MdFilterList size={22} />}
          onClick={onOpenFiltros}
          style={{
            border: "1px solid #1890ff",
            color: "#1890ff",
            display: "flex",
            alignItems: "center",
          }}
        />
      </Space>
    </div>
  );
};

export default HeaderMovimientos;
