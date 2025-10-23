import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select } from "antd";
import "./index.css";

const { Option } = Select;

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const denominacionRef = useRef(null);

  // 💡 State para manejar la visibilidad del campo Stock
  const [itemType, setItemType] = useState(null);

  useEffect(() => {
    if (denominacionRef.current) denominacionRef.current.focus();
  }, []);

  useEffect(() => {
    // 💡 Referencia 'items'
    const items = JSON.parse(localStorage.getItem("items") || "[]");

    if (isEdit) {
      const itemToEdit = items.find((i) => i.id === parseInt(id));
      if (itemToEdit) {
        form.setFieldsValue(itemToEdit);
        setItemType(itemToEdit.tipo_item); // Establecer el tipo al cargar para edición
      }
    }
  }, [isEdit, id, form]);

  const onFinish = (values) => {
    setLoading(true);

    const items = JSON.parse(localStorage.getItem("items") || "[]");
    let updatedItems;

    // Aseguramos que el stock sea 0 si es un servicio
    const finalValues = {
      ...values,
      stock_actual:
        values.tipo_item === "SERVICIO" ? 0 : values.stock_actual || 0,
    };

    if (isEdit) {
      updatedItems = items.map((item) =>
        item.id === parseInt(id) ? { ...item, ...finalValues } : item
      );
    } else {
      const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      updatedItems = [...items, { id: newId, ...finalValues }];
    }

    localStorage.setItem("items", JSON.stringify(updatedItems)); // 💡 Referencia 'items'

    setTimeout(() => {
      setLoading(false);
      message.success(
        isEdit
          ? "Ítem actualizado correctamente"
          : "Ítem registrado correctamente"
      );
      navigate("/items"); // 💡 Ruta de navegación adaptada a '/items'
    }, 500);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 className="header-title">
        {isEdit ? "Modificar Ítem" : "Nuevo Producto/Servicio"}
      </h1>

      <Form
        id="item-form" // 💡 Nueva clase CSS
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="item-form" // 💡 Nueva clase CSS
        initialValues={{ tipo_item: "PRODUCTO" }} // Valor por defecto
      >
        {isEdit && (
          <Form.Item label="ID" name="id" initialValue={id}>
            <Input disabled />
          </Form.Item>
        )}

        {/* 💡 Campo Tipo de Ítem (CLAVE) */}
        <Form.Item
          label="Tipo de Ítem"
          name="tipo_item"
          rules={[{ required: true, message: "Seleccione el tipo" }]}
        >
          <Select
            placeholder="Seleccione Producto o Servicio"
            onChange={(value) => setItemType(value)} // Actualiza el state para la lógica condicional
            disabled={isEdit} // No permitir cambiar el tipo si ya está en uso (regla de negocio sugerida)
          >
            <Option value="PRODUCTO">PRODUCTO (Controla Stock)</Option>
            <Option value="SERVICIO">SERVICIO (No controla Stock)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Denominación"
          name="denominacion"
          rules={[{ required: true, message: "Ingrese la denominación" }]}
        >
          <Input
            ref={denominacionRef}
            placeholder="Nombre del producto o servicio"
          />
        </Form.Item>

        {/* 💡 Campo Precio (Añadido) */}
        <Form.Item
          label="Precio de Venta"
          name="precio"
          rules={[
            { required: true, message: "Ingrese el precio" },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: "Formato de precio inválido (ej: 100.00)",
            },
          ]}
        >
          <Input placeholder="Ej: 150.50" type="number" step="0.01" />
        </Form.Item>

        {/* 💡 Campos de Stock (CONDICIONALES) */}
        {itemType === "PRODUCTO" && (
          <Form.Item
            label="Stock Inicial/Actual"
            name="stock_actual"
            rules={[{ required: true, message: "Ingrese el stock inicial" }]}
            initialValue={0}
          >
            <Input placeholder="Unidades disponibles" type="number" min="0" />
          </Form.Item>
        )}

        <div className="form-buttons">
          <Button onClick={() => navigate("/items")}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: 8 }}
          >
            {isEdit ? "Guardar Cambios" : "Registrar Ítem"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ItemDetail;
