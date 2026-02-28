import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Card, message, Spin } from "antd";
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
    const db = JSON.parse(localStorage.getItem(`db_${tipo}`)) || [];

    if (isEdit) {
      const item = db.find((e) => String(e.id) === String(id));
      if (item) {
        form.setFieldsValue(item);
      } else {
        message.error("No se encontró el registro");
        navigate(`/entidades/${tipo}`);
      }
    } else {
      // 🚀 Por defecto ACTIVO al crear
      form.setFieldsValue({ activo: true });
    }
    setLoading(false);
  }, [id, tipo, isEdit, form, navigate]);

  // En EntidadDetalleContainer.jsx
  const onSave = (values) => {
    const db = JSON.parse(localStorage.getItem(`db_${tipo}`)) || [];

    if (isEdit) {
      // 🔍 Buscamos y actualizamos. "values" ya trae activo: false si vino del botón eliminar
      const nuevaLista = db.map((e) =>
        String(e.id) === String(id) ? { ...e, ...values } : e,
      );
      localStorage.setItem(`db_${tipo}`, JSON.stringify(nuevaLista));
    } else {
      const ultimoNro =
        db.length > 0 ? Math.max(...db.map((e) => parseInt(e.nro) || 0)) : 0;
      const nuevoItem = {
        ...values,
        id: Date.now(),
        nro: ultimoNro + 1,
        activo: true, // Siempre activo al crear
      };
      localStorage.setItem(`db_${tipo}`, JSON.stringify([...db, nuevoItem]));
    }

    message.success(
      values.activo === false ? "Entidad eliminada" : "Guardado correctamente",
    );
    navigate(`/entidades/${tipo}`);
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
            onFinish={onSave}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default EntidadDetalleContainer;
