import { useEffect, useState } from "react";
import { Form, Modal, message, Spin } from "antd";
import { MdClose } from "react-icons/md";
import { entidadService } from "../../../../services/entidadService";
import EntidadForm from "./components/EntidadForm";
import type { Entity, ServiceResult } from "@/types";

interface EntidadDetalleModalProps {
  open: boolean;
  onClose: () => void;
  tipo: string;
  editId: number | null;
  onSaved?: () => void;
}

interface CtaCteConfig {
  habilitado?: boolean;
  importeMaximo?: number | null;
  plazoDias?: number | null;
}

const EntidadDetalleModal = ({ open, onClose, tipo, editId, onSaved }: EntidadDetalleModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editId);
  const isCliente = tipo === "clientes";
  const colorTema = isCliente ? "#1890ff" : "#fa8c16";

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    if (isEdit && editId) {
      const item = entidadService.getById(tipo, editId);
      if (item) {
        const ctaConfig = (item.ctaCteConfig || {}) as CtaCteConfig;
        form.setFieldsValue({
          ...item,
          ctaCteConfig: ctaConfig.habilitado !== undefined ? ctaConfig : {
            habilitado: false,
            importeMaximo: null,
            plazoDias: null,
          },
        });
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ activo: true });
    }
    setLoading(false);
  }, [open, editId, tipo, form, isEdit]);

  const handleDelete = () => {
    if (editId) {
      entidadService.softDelete(tipo, editId);
      message.success("Entidad eliminada");
      onSaved?.();
      onClose();
    }
  };

  const onSave = (values: Entity) => {
    let result: ServiceResult;
    if (isEdit && editId) {
      result = entidadService.update(tipo, editId, values);
    } else {
      result = entidadService.create(tipo, values);
    }
    if (result.success) {
      message.success("Guardado correctamente");
      onSaved?.();
      onClose();
    } else {
      message.error("Error al guardar");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={isEdit ? `Editar ${isCliente ? "Cliente" : "Proveedor"}` : `Nuevo ${isCliente ? "Cliente" : "Proveedor"}`}
      centered
      width={400}
      closeIcon={<MdClose size={20} />}
    >
      <Spin spinning={loading}>
        <EntidadForm
          form={form}
          isEdit={isEdit}
          colorTema={colorTema}
          isCliente={isCliente}
          onFinish={onSave}
          onDelete={handleDelete}
        />
      </Spin>
    </Modal>
  );
};

export default EntidadDetalleModal;
