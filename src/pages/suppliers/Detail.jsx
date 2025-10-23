import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "./index.css";

const SupplierDetail = () => {
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
    // 💡 Cambiado de 'clients' a 'suppliers'
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");

    // Si no hay data inicial, cargarla
    if (!suppliers.length && !isEdit) {
      localStorage.setItem("suppliers", JSON.stringify([]));
    }

    if (isEdit) {
      const supplierToEdit = suppliers.find((s) => s.id === parseInt(id));
      if (supplierToEdit) form.setFieldsValue(supplierToEdit);
    }
  }, [isEdit, id, form]);

  // 🔹 Manejo de submit
  const onFinish = (values) => {
    setLoading(true);

    // 💡 Cambiado de 'clients' a 'suppliers'
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    let updatedSuppliers;

    if (isEdit) {
      updatedSuppliers = suppliers.map((supplier) =>
        supplier.id === parseInt(id) ? { ...supplier, ...values } : supplier
      );
    } else {
      const newId = suppliers.length
        ? Math.max(...suppliers.map((s) => s.id)) + 1
        : 1;
      updatedSuppliers = [...suppliers, { id: newId, ...values }];
    }

    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));

    setTimeout(() => {
      setLoading(false);
      message.success(
        // 💡 Cambiado de 'Cliente' a 'Proveedor'
        isEdit
          ? "Proveedor actualizado correctamente"
          : "Proveedor registrado correctamente"
      );
      // 💡 Cambiada la ruta de navegación
      navigate("/suppliers");
    }, 500);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 className="header-title">
        {/* 💡 Cambiado de 'Cliente' a 'Proveedor' */}
        {isEdit ? "Modificar Proveedor" : "Nuevo Proveedor"}
      </h1>

      <Form
        id="supplier-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="supplier-form"
      >
        {isEdit && (
          <Form.Item label="ID" name="id" initialValue={id}>
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          label="Nombre o Denominación"
          name="denominacion"
          rules={[{ required: true, message: "Ingrese el nombre" }]}
        >
          <Input
            ref={denominacionRef}
            // 💡 Cambiado de 'cliente' a 'proveedor'
            placeholder="Ingrese el nombre del proveedor"
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
          {/* 💡 Cambiada la ruta de navegación */}
          <Button onClick={() => navigate("/suppliers")}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: 8 }}
          >
            {/* 💡 Cambiado de 'Cliente' a 'Proveedor' */}
            {isEdit ? "Guardar Cambios" : "Registrar Proveedor"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SupplierDetail;
