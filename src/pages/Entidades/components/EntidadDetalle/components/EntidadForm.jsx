import React from "react";
import { Form, Input, Button, Space, Popconfirm } from "antd";
import { MdSave, MdDeleteOutline, MdPhone } from "react-icons/md";

/**
 * Componente Presentacional del Formulario de Entidades
 * @param {Object} form - Instancia de Form de Ant Design
 * @param {Boolean} isEdit - Define si estamos editando o creando
 * @param {String} colorTema - Color principal (Azul para clientes, Naranja para proveedores)
 * @param {Boolean} isCliente - Define el texto dinámico del botón
 * @param {Function} onFinish - Función que procesa el guardado
 */
const EntidadForm = ({ form, isEdit, colorTema, isCliente, onFinish }) => {
  // Función para manejar la eliminación (Baja Lógica)
  const handleConfirmDelete = () => {
    // Obtenemos los valores actuales del form y forzamos activo: false
    const currentValues = form.getFieldsValue();
    onFinish({ ...currentValues, activo: false });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false} // Limpia los asteriscos rojos para un look más moderno
    >
      {/* Nota: El campo NRO y ID están ocultos por requerimiento, 
          pero se gestionan internamente en el Container. 
      */}

      <Form.Item
        name="nombre"
        label="Denominación / Nombre"
        rules={[{ required: true, message: "La denominación es obligatoria" }]}
      >
        <Input
          placeholder="Ej: Juan Pérez o Empresa S.A."
          size="large"
          style={{ padding: "12px", borderRadius: "8px" }}
        />
      </Form.Item>

      <Form.Item name="telefono" label="Teléfono de Contacto">
        <Input
          type="number"
          inputMode="numeric"
          prefix={<MdPhone color={colorTema} style={{ marginRight: "8px" }} />}
          placeholder="Ej: 3511234567"
          size="large"
          style={{ padding: "12px", borderRadius: "8px" }}
        />
      </Form.Item>

      <Space
        direction="vertical"
        style={{ width: "100%", marginTop: "24px" }}
        size={16}
      >
        {/* BOTÓN GUARDAR */}
        <Button
          type="primary"
          block
          size="large"
          htmlType="submit"
          icon={<MdSave size={22} />}
          style={{
            height: "54px",
            borderRadius: "12px",
            backgroundColor: colorTema,
            borderColor: colorTema,
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Guardar {isCliente ? "Cliente" : "Proveedor"}
        </Button>

        {/* BOTÓN ELIMINAR (Solo en edición) */}
        {isEdit && (
          <Popconfirm
            title="¿Deseas eliminar esta entidad?"
            description="Ya no aparecerá en el listado de activos."
            onConfirm={handleConfirmDelete}
            okText="Eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true, size: "large" }}
            cancelButtonProps={{ size: "large" }}
          >
            <Button
              type="text"
              danger
              block
              icon={<MdDeleteOutline size={22} />}
              style={{
                marginTop: "8px",
                fontWeight: "500",
              }}
            >
              Eliminar
            </Button>
          </Popconfirm>
        )}
      </Space>
    </Form>
  );
};

export default EntidadForm;
