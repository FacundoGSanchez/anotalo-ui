import React from "react";
import { Modal, Typography, Tag, Space, Divider, Button, Tooltip } from "antd";
import { MdRestartAlt, MdOutlineLayersClear } from "react-icons/md";
import {
  MOVIMIENTO_TIPOS,
  NOMBRES_FORMAS_PAGO,
} from "../../../constants/posConstants";

const { Text } = Typography;
const { CheckableTag } = Tag;

const ModalFiltros = ({
  open,
  onClose,
  tipos,
  setTipos,
  formas,
  setFormas,
  onReset,
}) => {
  const handleToggle = (list, setList, tag, checked) => {
    const next = checked ? [...list, tag] : list.filter((t) => t !== tag);
    setList(next);
  };

  const handleClearAll = () => {
    setTipos([]);
    setFormas([]);
  };

  return (
    <Modal
      title="Filtros de Búsqueda"
      open={open}
      onCancel={onClose}
      width={320}
      centered
      footer={[
        <div
          key="footer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space size={4}>
            <Tooltip title="Reestablecer todo">
              <Button
                type="text"
                danger
                icon={<MdRestartAlt size={22} />}
                onClick={onReset}
              />
            </Tooltip>
            <Tooltip title="Limpiar selección">
              <Button
                type="text"
                icon={<MdOutlineLayersClear size={22} />}
                onClick={handleClearAll}
                style={{ color: "#8c8c8c" }}
              />
            </Tooltip>
          </Space>
          <Button
            type="primary"
            onClick={onClose}
            style={{ borderRadius: "8px" }}
          >
            Ver resultados
          </Button>
        </div>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* SECCIÓN TIPOS */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Tipos
          </Text>
          <Space wrap size={[4, 8]}>
            {Object.values(MOVIMIENTO_TIPOS).map((tag) => (
              <CheckableTag
                key={tag}
                checked={tipos.includes(tag)}
                onChange={(c) => handleToggle(tipos, setTipos, tag, c)}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  margin: 0,
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* SECCIÓN FORMAS DE PAGO */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Formas de Pago
          </Text>
          <Space wrap size={[4, 8]}>
            {NOMBRES_FORMAS_PAGO.map((tag) => (
              <CheckableTag
                key={tag}
                checked={formas.includes(tag)}
                onChange={(c) => handleToggle(formas, setFormas, tag, c)}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  margin: 0,
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFiltros;
