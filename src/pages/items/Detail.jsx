import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select, Row, Col } from "antd";
import "./index.css";

const { Option } = Select;

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const denominacionRef = useRef(null);

  // El estado inicial es null, indicando que no hay selección.
  const [itemType, setItemType] = useState(null);

  useEffect(() => {
    if (denominacionRef.current) denominacionRef.current.focus();
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");

    if (isEdit) {
      const itemToEdit = items.find((i) => i.id === parseInt(id));
      if (itemToEdit) {
        form.setFieldsValue(itemToEdit);
        setItemType(itemToEdit.tipo_item);
      }
    }
  }, [isEdit, id, form]);

  const onFinish = (values) => {
    setLoading(true);

    const items = JSON.parse(localStorage.getItem("items") || "[]");
    let updatedItems;

    const finalValues = {
      ...values,
      stock_actual:
        values.tipo_item === "SERVICIO" ? 0 : values.stock_actual || 0,
      codigo_barras:
        values.tipo_item === "SERVICIO" ? null : values.codigo_barras || null,
    };

    if (isEdit) {
      updatedItems = items.map((item) =>
        item.id === parseInt(id) ? { ...item, ...finalValues } : item
      );
    } else {
      const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      updatedItems = [...items, { id: newId, ...finalValues }];
    }

    localStorage.setItem("items", JSON.stringify(updatedItems));

    setTimeout(() => {
      setLoading(false);
      message.success(
        isEdit
          ? "Ítem actualizado correctamente"
          : "Ítem registrado correctamente"
      );
      navigate("/items");
    }, 500);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 className="header-title">
        {isEdit ? "Modificar Ítem" : "Nuevo Producto/Servicio"}
      </h1>

      <Form
        id="item-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="item-form"
      >
        {isEdit && (
          <Form.Item label="ID" name="id" initialValue={id}>
            <Input disabled />
          </Form.Item>
        )}

        {/* Campo Tipo de Ítem (CLAVE) */}
        <Form.Item
          label="Tipo de Ítem"
          name="tipo_item"
          rules={[{ required: true, message: "Seleccione el tipo" }]}
        >
          <Select
            placeholder="Seleccione Producto o Servicio"
            onChange={(value) => setItemType(value)}
            disabled={isEdit}
          >
            <Option value="PRODUCTO">PRODUCTO (Controla Stock)</Option>
            <Option value="SERVICIO">SERVICIO (No controla Stock)</Option>
          </Select>
        </Form.Item>

        {/* 💡 Nuevo bloque: Los campos restantes solo se muestran si ya se eligió un tipo */}
        {itemType && (
          <>
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

            {itemType === "PRODUCTO" && (
              <Form.Item
                label="Código de Barras"
                name="codigo_barras"
                tooltip="Opcional. Se utiliza para la búsqueda rápida en el punto de venta."
              >
                <Input placeholder="Ej: 7790012345026" />
              </Form.Item>
            )}

            <Row gutter={16}>
              <Col xs={24} md={itemType === "PRODUCTO" ? 12 : 24}>
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
              </Col>

              {itemType === "PRODUCTO" && (
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Stock Inicial/Actual"
                    name="stock_actual"
                    rules={[
                      { required: true, message: "Ingrese el stock inicial" },
                    ]}
                    initialValue={0}
                  >
                    <Input
                      placeholder="Unidades disponibles"
                      type="number"
                      min="0"
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </>
        )}

        <div className="form-buttons">
          <Button onClick={() => navigate("/items")}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: 8 }}
            disabled={!itemType} // Deshabilita el botón Guardar hasta que se elija un tipo
          >
            {isEdit ? "Guardar Cambios" : "Registrar Ítem"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ItemDetail;
