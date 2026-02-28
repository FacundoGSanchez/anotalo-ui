import React from "react";
import { Button, Typography } from "antd";
import { MdArrowBack } from "react-icons/md";

const { Title } = Typography;

const EntidadHeader = ({ isEdit, isCliente, onBack }) => {
  const accion = isEdit ? "Editar" : "Nuevo";
  const sujeto = isCliente ? "Cliente" : "Proveedor";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}
    >
      <div style={{ width: "40px" }}>
        <Button
          icon={<MdArrowBack size={24} />}
          type="text"
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>

      <Title level={4} style={{ margin: 0, textAlign: "center", flex: 1 }}>
        {`${accion} ${sujeto}`}
      </Title>

      <div style={{ width: "40px" }} />
    </div>
  );
};

export default EntidadHeader;
