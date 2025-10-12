import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "./index.css";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const denominacionRef = useRef(null);

  // 🔹 Foco en denominación al iniciar
  useEffect(() => {
    if (denominacionRef.current) denominacionRef.current.focus();
  }, []);

  // 🔹 Precargar datos si es edición
  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    // Si no hay data inicial, cargarla
    if (!clients.length) {
      localStorage.setItem("clients", JSON.stringify([]));
    }

    if (isEdit) {
      const clientToEdit = clients.find((c) => c.id === parseInt(id));
      if (clientToEdit) form.setFieldsValue(clientToEdit);
    }
  }, [isEdit, id, form]);

  // 🔹 Manejo de submit
  const onFinish = (values) => {
    setLoading(true);

    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    let updatedClients;

    if (isEdit) {
      updatedClients = clients.map((client) =>
        client.id === parseInt(id) ? { ...client, ...values } : client
      );
    } else {
      const newId = clients.length
        ? Math.max(...clients.map((c) => c.id)) + 1
        : 1;
      updatedClients = [...clients, { id: newId, ...values }];
    }

    localStorage.setItem("clients", JSON.stringify(updatedClients));

    setTimeout(() => {
      setLoading(false);
      message.success(
        isEdit
          ? "Cliente actualizado correctamente"
          : "Cliente registrado correctamente"
      );
      navigate("/clients");
    }, 500);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 className="header-title">
        {isEdit ? "Modificar Cliente" : "Nuevo Cliente"}
      </h1>

      <Form
        id="client-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="client-form"
      >
        {isEdit && (
          <Form.Item label="ID" name="id" initialValue={id}>
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          label="Nombre"
          name="denominacion"
          rules={[{ required: true, message: "Ingrese el nombre" }]}
        >
          <Input
            ref={denominacionRef}
            placeholder="Ingrese el nombre del cliente"
          />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[
            { required: true, message: "Ingrese el teléfono" },
            {
              pattern: /^[0-9\s-]+$/,
              message: "Solo números y guiones son válidos",
            },
          ]}
        >
          <Input placeholder="Ej: 351-1234567" />
        </Form.Item>

        <div className="form-buttons">
          <Button onClick={() => navigate("/clients")}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: 8 }}
          >
            {isEdit ? "Guardar Cambios" : "Registrar Cliente"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ClientDetail;
