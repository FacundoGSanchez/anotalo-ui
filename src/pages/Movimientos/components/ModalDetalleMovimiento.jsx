import React from "react";
import {
  Modal,
  Button,
  Descriptions,
  Divider,
  Tag,
  Popconfirm,
  message,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { MdDeleteOutline, MdInfoOutline } from "react-icons/md";

// Desestructuramos aquí para que <Text> sea el de Ant Design y no el nativo del DOM
const { Text } = Typography;

const ModalDetalleMovimiento = ({
  visible,
  movimiento,
  onClose,
  onUpdateList,
}) => {
  if (!movimiento) return null;

  const handleDelete = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
      const filtered = saved.filter((m) => m.id !== movimiento.id);
      localStorage.setItem("movimientos_db", JSON.stringify(filtered));
      onUpdateList(filtered);
      message.success("Movimiento eliminado");
      onClose();
    } catch (error) {
      message.error("Error al eliminar");
    }
  };

  const isVenta = movimiento.tipo === "Venta";

  return (
    <Modal
      title={
        <Space>
          <MdInfoOutline style={{ color: isVenta ? "#1890ff" : "#fa8c16" }} />
          <span>Detalle de {movimiento.tipo}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      centered
      footer={[
        <Popconfirm
          key="delete"
          title="¿Eliminar movimiento?"
          onConfirm={handleDelete}
          okText="Sí, borrar"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<MdDeleteOutline />}
            style={{ float: "left" }}
          >
            Eliminar
          </Button>
        </Popconfirm>,
        <Button key="ok" type="primary" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <div style={{ padding: "8px 0" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "14px", display: "block" }}>
            IMPORTE
          </Text>
          <Text
            strong
            style={{ fontSize: "38px", color: isVenta ? "#52c41a" : "#ff4d4f" }}
          >
            ${" "}
            {movimiento.importe.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </div>

        <Descriptions
          column={1}
          size="small"
          bordered
          labelStyle={{ fontSize: "14px" }}
          contentStyle={{ fontSize: "14px" }}
        >
          <Descriptions.Item label="Operación">
            {movimiento.formaPago} |{" "}
            {dayjs(movimiento.fecha).format("DD/MM/YYYY HH:mm")} hs
          </Descriptions.Item>
          <Descriptions.Item label="Entidad">
            {movimiento.entidad?.nombre || "General"}
          </Descriptions.Item>
          <Descriptions.Item label="Usuario">
            {/* Aquí usamos <Text> de forma segura */}
            <Text strong>{movimiento.usuario}</Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ModalDetalleMovimiento;
