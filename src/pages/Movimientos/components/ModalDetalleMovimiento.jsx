import React, { useState } from "react";
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
import { MdDeleteOutline, MdInfoOutline, MdEdit } from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../constants/posConstants";

// Reutilizamos el selector para editar la entidad
import SelectorEntidadModal from "../../POSAnotalo/components/steps/components/SelectorEntidadModal";

// Desestructuramos aquí para que <Text> sea el de Ant Design y no el nativo del DOM
const { Text } = Typography;

const ModalDetalleMovimiento = ({
  visible,
  movimiento,
  onClose,
  onUpdateList,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

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

  const handleUpdateEntidad = (nuevaEntidad) => {
    try {
      const saved = JSON.parse(localStorage.getItem("movimientos_db")) || [];
      const index = saved.findIndex((m) => m.id === movimiento.id);
      if (index !== -1) {
        saved[index].entidad = nuevaEntidad;
        localStorage.setItem("movimientos_db", JSON.stringify(saved));
        onUpdateList(saved);
        message.success("Entidad actualizada");
        setIsSelectorOpen(false);
        onClose(); // Cerramos el detalle para refrescar la vista global
      }
    } catch (error) {
      message.error("Error al actualizar");
    }
  };

  const isVenta = movimiento.tipo === "Venta";
  const tablaDB = isVenta ? "db_clientes" : "db_proveedores";
  const activeColor = isVenta ? "#1890ff" : "#fa8c16";

  return (
    <>
      <Modal
        title={
          <Space>
            <MdInfoOutline style={{ color: activeColor }} />
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
              style={{
                float: "left",
                height: "48px",
                fontSize: "16px",
                padding: "0 24px",
              }}
            >
              Eliminar
            </Button>
          </Popconfirm>,
          <Button
            key="ok"
            type="primary"
            onClick={onClose}
            style={{
              height: "48px",
              fontSize: "16px",
              padding: "0 32px",
              borderRadius: "8px",
            }}
          >
            Cerrar
          </Button>,
        ]}
        styles={{ body: { padding: "32px 16px" } }}
      >
        <div style={{ padding: "8px 0" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "24px",
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "16px",
            }}
          >
            <Text
              type="secondary"
              style={{
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
              }}
            >
              IMPORTE TOTAL
            </Text>
            <Text
              strong
              style={{
                fontSize: "32px",
                color: isVenta ? "#52c41a" : "#ff4d4f",
              }}
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
            labelStyle={{ fontSize: "13px", color: "#8c8c8c", width: "120px" }}
            contentStyle={{ fontSize: "14px", padding: "12px" }}
          >
            <Descriptions.Item label="Medio de Pago">
              {movimiento.formaPago}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">
              {dayjs(movimiento.fecha).format("DD/MM/YYYY HH:mm")} hs
            </Descriptions.Item>
            <Descriptions.Item label="Entidad">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong>{movimiento.entidad?.nombre || "General"}</Text>
                {(movimiento.tipo === MOVIMIENTO_TIPOS.VENTA ||
                  movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) && (
                  <Button
                    type="link"
                    size="small"
                    icon={<MdEdit />}
                    onClick={() => setIsSelectorOpen(true)}
                  />
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Usuario">
              <Text>{movimiento.usuario}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>

      <SelectorEntidadModal
        open={isSelectorOpen}
        onCancel={() => setIsSelectorOpen(false)}
        onSelect={handleUpdateEntidad}
        tipo={movimiento.tipo}
        tablaDB={tablaDB}
        activeColor={activeColor}
      />
    </>
  );
};

export default ModalDetalleMovimiento;
