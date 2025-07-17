import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Radio } from "antd";
import "./Client.css";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Estado para tipo de cliente: "Persona" o "Organización"
  const [tipoCliente, setTipoCliente] = useState("persona");

  
  // Definir label dinámico
  const labelDenominacion =
    tipoCliente === "empresa" ? "Razón Social" : "Nombre";

  // Actualizar tipoCliente y limpiar denominacion si cambia
  const onTipoClienteChange = (e) => {
    setTipoCliente(e.target.value);
  };

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(
        isEdit
          ? "Cliente actualizado correctamente"
          : "Cliente registrado correctamente"
      );
      navigate("/clients");
    }, 1000);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div className="header-container">
        <h1 className="header-title">
          {isEdit ? "Modificar Cliente" : "Nuevo Cliente"}
        </h1>

        <div className="header-buttons">
          <Button
            type="primary"
            htmlType="submit"
            form="client-form"
            loading={loading}
          >
            {isEdit ? "Guardar Cambios" : "Registrar Cliente"}
          </Button>
          <Button onClick={() => navigate("/clients")}>Atrás</Button>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Tipo de cliente"
          name="tipoCliente"
          initialValue={tipoCliente}
        >
          <Radio.Group onChange={onTipoClienteChange} value={tipoCliente}>
            <Radio value="persona">Persona Física</Radio>
            <Radio value="empresa">Organización</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      <Form
        id="client-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ tipoCliente }}
      >
        <Form.Item
          label={labelDenominacion}
          name="denominacion"
          rules={[
            {
              required: true,
              message: `Ingrese el/la ${labelDenominacion.toLowerCase()}`,
            },
          ]}
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
      </Form>
    </div>
  );
};

export default ClientDetail;
