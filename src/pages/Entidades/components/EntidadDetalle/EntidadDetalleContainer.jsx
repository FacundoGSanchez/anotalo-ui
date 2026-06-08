import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Card, message, Spin } from "antd";
import { entidadService } from "../../../../services/entidadService";
import EntidadHeader from "./components/EntidadHeader";
import EntidadForm from "./components/EntidadForm";

const EntidadDetalleContainer = () => {
  const { tipo, action, id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const isEdit = action === "edit" && Boolean(id);
  const isCliente = tipo === "clientes";
  const colorTema = isCliente ? "#1890ff" : "#fa8c16";

  useEffect(() => {
    setLoading(true);

    if (isEdit) {
      const item = entidadService.getById(tipo, id);
      if (item) {
        form.setFieldsValue({
          ...item,
          ctaCteConfig: item.ctaCteConfig || {
            habilitado: false,
            importeMaximo: null,
            plazoDias: null,
          },
        });
      } else {
        message.error("No se encontró el registro");
        navigate(`/entidades/${tipo}`);
      }
    } else {
      form.setFieldsValue({ activo: true });
    }
    setLoading(false);
  }, [id, tipo, isEdit, form, navigate]);

  const onSave = (values) => {
    let result;

    if (isEdit) {
      result = entidadService.update(tipo, id, values);
    } else {
      result = entidadService.create(tipo, values);
    }

    if (result.success) {
      message.success(
        values.activo === false ? "Entidad eliminada" : "Guardado correctamente",
      );
      navigate(`/entidades/${tipo}`);
    } else {
      message.error("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
      <EntidadHeader
        isEdit={isEdit}
        isCliente={isCliente}
        onBack={() => navigate(`/entidades/${tipo}`)}
      />

      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <Spin spinning={loading}>
          <EntidadForm
            form={form}
            isEdit={isEdit}
            colorTema={colorTema}
            isCliente={isCliente}
            onFinish={onSave}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default EntidadDetalleContainer;
