import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const clienteExistente = {
        denominacion: "Ejemplo SRL",
        telefono: "3511234567",
        iva: "Monotributo",
      };
      form.setFieldsValue(clienteExistente);
    }
  }, [id, form, isEdit]);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isEdit) {
        message.success("Cliente actualizado correctamente");
      } else {
        message.success("Cliente registrado correctamente");
      }
      navigate("/clients");
    }, 1000);
  };

  return (
    <div className="client-detail-container">
      <div className="client-detail-header">
        <h1 className="client-detail-title">
          {isEdit ? "Modificar Cliente" : "Nuevo Cliente"}
        </h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ iva: "Responsable Inscripto" }}
        className="client-detail-form"
      >
        <Form.Item
          label="Denominación"
          name="denominacion"
          rules={[{ required: true, message: "Ingrese la denominación" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[{ required: true, message: "Ingrese el teléfono" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Condición frente al IVA"
          name="iva"
          rules={[{ required: true, message: "Ingrese el tipo de IVA" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Guardar Cambios" : "Registrar Cliente"}
          </Button>
          <Button
            className="client-detail-back-button"
            onClick={() => navigate("/clients")}
          >
            Atrás
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClientDetail;
