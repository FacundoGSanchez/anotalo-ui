import React, { useState } from "react";
import {
  Modal,
  Button,
  Popconfirm,
  message,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  MdDeleteOutline,
  MdInfoOutline,
  MdEdit,
  MdWallet,
  MdPerson,
} from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { movimientoService } from "../../../../services/movimientoService";

import SelectorEntidadModal from "../../../POSAnotalo/components/steps/components/SelectorEntidadModal";

const { Text } = Typography;

const RUBROS_MOCK = [
  { sigla: "V", nombre: "Varios", grupo: "General" },
  { sigla: "K", nombre: "Kiosco", grupo: "Alimentos" },
  { sigla: "B", nombre: "Bebidas", grupo: "Alimentos" },
  { sigla: "F", nombre: "Fiambrería", grupo: "Alimentos" },
  { sigla: "P", nombre: "Panadería", grupo: "Alimentos" },
];

const grupos = [...new Set(RUBROS_MOCK.map((r) => r.grupo))];

const ModalDetalleMovimiento = ({
  visible,
  movimiento,
  onClose,
  onUpdateList,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [rubroModalOpen, setRubroModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  if (!movimiento) return null;

  const handleDelete = () => {
    const result = movimientoService.deleteById(movimiento.id);
    if (result.success) {
      onUpdateList(movimientoService.getAll());
      message.success("Movimiento eliminado");
      onClose();
    } else {
      message.error("Error al eliminar");
    }
  };

  const handleUpdateEntidad = (nuevaEntidad) => {
    const result = movimientoService.update(movimiento.id, {
      entidad: nuevaEntidad,
    });
    if (result.success) {
      onUpdateList(movimientoService.getAll());
      message.success("Entidad actualizada");
      setIsSelectorOpen(false);
      onClose();
    } else {
      message.error("Error al actualizar");
    }
  };

  const cambiarRubroItem = (itemId, nuevoRubro) => {
    const lineItems = (movimiento.lineItems || []).map((item) =>
      (item.id || item._id) === itemId
        ? { ...item, rubro: nuevoRubro }
        : item,
    );
    const result = movimientoService.update(movimiento.id, { lineItems });
    if (result.success) {
      onUpdateList(movimientoService.getAll());
      message.success("Rubro actualizado");
      setRubroModalOpen(false);
      setEditItemId(null);
    } else {
      message.error("Error al actualizar rubro");
    }
  };

  const isVenta = movimiento.tipo === "Venta" || movimiento.tipo === "Cobro";
  const tablaDB = isVenta ? "db_clientes" : "db_proveedores";
  const activeColor = isVenta ? "#1890ff" : "#fa8c16";

  const renderRubroModal = () => (
    <Modal
      open={rubroModalOpen}
      onCancel={() => { setRubroModalOpen(false); setEditItemId(null); }}
      footer={null}
      title="Cambiar rubro"
      centered
      width={340}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
        {grupos.map((grupo) => (
          <div key={grupo}>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
              {grupo}
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {RUBROS_MOCK.filter((r) => r.grupo === grupo).map((rubro) => {
                const item = movimiento.lineItems?.find(
                  (i) => (i.id || i._id) === editItemId,
                );
                const isSelected = item?.rubro?.sigla === rubro.sigla;
                return (
                  <button
                    key={rubro.sigla}
                    onClick={() => cambiarRubroItem(editItemId, rubro)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: `2px solid ${isSelected ? activeColor : "#e8e8e8"}`,
                      background: isSelected ? `${activeColor}10` : "#fafafa",
                      color: isSelected ? activeColor : "#595959",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {rubro.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  return (
    <>
      {renderRubroModal()}
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
        styles={{ body: { padding: "24px 16px" } }}
      >
        <div style={{ padding: "0" }}>
          {/* IMPORTE TOTAL card with date */}
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#fff",
              borderRadius: "16px",
              marginBottom: "16px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Text
              type="secondary"
              style={{ fontSize: "11px", fontWeight: 700, display: "block", letterSpacing: "0.5px" }}
            >
              IMPORTE TOTAL
            </Text>
            <Text
              strong
              style={{
                fontSize: "32px",
                color: isVenta ? "#52c41a" : "#ff4d4f",
                display: "block",
                lineHeight: 1.2,
                marginTop: "4px",
              }}
            >
              ${" "}
              {movimiento.importe.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: "11px", marginTop: "6px", display: "block" }}
            >
              {dayjs(movimiento.fecha).format("DD/MM/YYYY")} {movimiento.hora} hs
            </Text>
          </div>

          {/* DETALLE DE ÍTEMS card */}
          {movimiento.lineItems?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  paddingLeft: "4px",
                }}
              >
                DETALLE DE ÍTEMS
              </Text>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #f0f0f0",
                  overflow: "hidden",
                }}
              >
                {movimiento.lineItems.map((item, idx) => (
                  <div
                    key={item.id || item._id || idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderBottom:
                        idx < movimiento.lineItems.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: `${activeColor}12`,
                          color: activeColor,
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: "16px", fontWeight: 800, lineHeight: 1 }}>
                          {item.rubro?.sigla || "V"}
                        </span>
                        <span style={{ fontSize: "7px", fontWeight: 600, lineHeight: 1, opacity: 0.8 }}>
                          {item.rubro?.nombre || "Varios"}
                        </span>
                      </div>
                      <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                        $ {item.importe.toLocaleString("es-AR")}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<MdEdit size={15} />}
                      onClick={() => { setEditItemId(item.id || item._id); setRubroModalOpen(true); }}
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8c8c8c",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATOS section - no border */}
          <div>
            <Text
              type="secondary"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                display: "block",
                marginBottom: "8px",
                paddingLeft: "4px",
              }}
            >
              DATOS
            </Text>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                overflow: "hidden",
              }}
            >
              {/* Forma de pago */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${activeColor}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    flexShrink: 0,
                  }}
                >
                  <MdWallet size={18} color={activeColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
                    Forma de pago
                  </Text>
                  <Text strong style={{ fontSize: "14px" }}>
                    {movimiento.formaPago}
                  </Text>
                </div>
              </div>

              {/* Entidad */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${activeColor}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    flexShrink: 0,
                  }}
                >
                  <MdPerson size={18} color={activeColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
                    Entidad
                  </Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Text strong style={{ fontSize: "14px" }}>
                      {movimiento.entidad?.nombre || "General"}
                    </Text>
                    {(movimiento.tipo === MOVIMIENTO_TIPOS.VENTA ||
                      movimiento.tipo === MOVIMIENTO_TIPOS.PAGO ||
                      movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) && (
                      <Button
                        type="link"
                        size="small"
                        icon={<MdEdit size={14} />}
                        onClick={() => setIsSelectorOpen(true)}
                        style={{ padding: 0, height: "auto", color: "#8c8c8c", minWidth: "auto" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Usuario */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${activeColor}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    flexShrink: 0,
                  }}
                >
                  <MdPerson size={18} color={activeColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
                    Usuario
                  </Text>
                  <Text strong style={{ fontSize: "14px" }}>
                    {movimiento.usuario}
                  </Text>
                </div>
              </div>
            </div>
          </div>
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
