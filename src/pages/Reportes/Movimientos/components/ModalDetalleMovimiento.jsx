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
import "dayjs/locale/es";
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
  { id: 1, sigla: "V", nombre: "Varios", grupo: "General" },
  { id: 2, sigla: "K", nombre: "Kiosco", grupo: "Alimentos" },
  { id: 3, sigla: "B", nombre: "Bebidas", grupo: "Alimentos" },
  { id: 4, sigla: "F", nombre: "Fiambrería", grupo: "Alimentos" },
  { id: 5, sigla: "P", nombre: "Panadería", grupo: "Alimentos" },
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
  const [showAllItems, setShowAllItems] = useState(false);

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
        ? { ...item, itemId: nuevoRubro.id, itemDetalle: nuevoRubro.nombre }
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
                const isSelected = item?.itemId === rubro.id;
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
          {/* IMPORTE + DATOS MOVIMIENTO row */}
          <div
            style={{
              display: "flex",
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            {/* Left: Importe */}
            <div
              style={{
                flex: "0 0 45%",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
              }}
            >
              <Text
                type="secondary"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}
              >
                IMPORTE TOTAL
              </Text>
              <Text
                strong
                style={{
                  fontSize: "28px",
                  color: isVenta ? "#52c41a" : "#ff4d4f",
                  lineHeight: 1.2,
                  marginTop: "2px",
                }}
              >
                ${" "}
                {movimiento.importe.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: "10px", marginTop: "4px" }}
              >
                {(() => { const { fecha, hora } = movimientoService.extraerFechaHora(movimiento.fechaRegistro); return `${dayjs(fecha).locale("es").format("dddd, DD/MM/YYYY")} ${hora} hs`; })()}
              </Text>
            </div>

            {/* Divider */}
            <div style={{ width: "1px", background: "#f0f0f0" }} />

            {/* Right: Datos movimiento */}
            <div
              style={{
                flex: 1,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "6px",
                background: "#fff",
              }}
            >
              <Text
                type="secondary"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "2px" }}
              >
                DATOS MOVIMIENTO
              </Text>
              {/* Forma de pago */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdWallet size={14} color={activeColor} />
                <div style={{ lineHeight: 1.2 }}>
                  <Text type="secondary" style={{ fontSize: "9px", display: "block" }}>Forma de pago</Text>
                  <Text strong style={{ fontSize: "12px" }}>{movimiento.formaPagos ? movimiento.formaPagos.map(fp => `${fp.nombre || fp.key}: $${Number(fp.importe).toLocaleString("es-AR")}`).join(" + ") : movimiento.formaPago}</Text>
                </div>
              </div>
              {/* Entidad */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdPerson size={14} color={activeColor} />
                <div style={{ lineHeight: 1.2 }}>
                  <Text type="secondary" style={{ fontSize: "9px", display: "block" }}>Entidad</Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Text strong style={{ fontSize: "12px" }}>{movimiento.entidad?.nombre || "General"}</Text>
                    {(movimiento.tipo === MOVIMIENTO_TIPOS.VENTA ||
                      movimiento.tipo === MOVIMIENTO_TIPOS.PAGO ||
                      movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) && (
                      <Button
                        type="link"
                        size="small"
                        icon={<MdEdit size={11} />}
                        onClick={() => setIsSelectorOpen(true)}
                        style={{ padding: 0, height: "auto", color: "#8c8c8c", minWidth: "auto" }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Usuario */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdPerson size={14} color={activeColor} />
                <div style={{ lineHeight: 1.2 }}>
                  <Text type="secondary" style={{ fontSize: "9px", display: "block" }}>Usuario</Text>
                  <Text strong style={{ fontSize: "12px" }}>{movimiento.usuarioNombre || movimiento.usuario}</Text>
                </div>
              </div>
            </div>
          </div>

          {/* DETALLE DE ÍTEMS card */}
          {movimiento.lineItems?.length > 0 && (
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #f0f0f0",
                  background: "#fafafa",
                }}
              >
                <Text
                  type="secondary"
                  style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}
                >
                  DETALLE DE ÍTEMS ({movimiento.lineItems.length})
                </Text>
              </div>
              <div style={{ background: "#fff" }}>
                {(showAllItems
                  ? movimiento.lineItems
                  : movimiento.lineItems.slice(0, 3)
                ).map((item, idx) => (
                  <div
                    key={item.id || item._id || idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      borderBottom:
                        idx < movimiento.lineItems.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: `${activeColor}12`,
                          color: activeColor,
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1 }}>
                          {(item.itemDetalle || "V").charAt(0)}
                        </span>
                        <span style={{ fontSize: "6px", fontWeight: 600, lineHeight: 1, opacity: 0.8 }}>
                          {item.itemDetalle || "Varios"}
                        </span>
                      </div>
                      <Text strong style={{ fontSize: "13px", color: "#262626" }}>
                        $ {item.importe.toLocaleString("es-AR")}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<MdEdit size={12} />}
                      onClick={() => { setEditItemId(item.id || item._id); setRubroModalOpen(true); }}
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8c8c8c",
                      }}
                    />
                  </div>
                ))}
                {!showAllItems && movimiento.lineItems.length > 3 && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowAllItems(true)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowAllItems(true); } }}
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      cursor: "pointer",
                      color: activeColor,
                      fontSize: "12px",
                      fontWeight: 600,
                      borderTop: "1px solid #f0f0f0",
                      outline: "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `${activeColor}08`}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Ver más ({movimiento.lineItems.length - 3})
                  </div>
                )}
              </div>
            </div>
          )}
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
