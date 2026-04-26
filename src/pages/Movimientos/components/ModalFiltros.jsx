import React from "react";
import {
  Modal,
  Typography,
  Tag,
  Space,
  Divider,
  Button,
  Tooltip,
  message,
} from "antd";
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

  const handleConfirmar = () => {
    if (tipos.length === 0 || formas.length === 0) {
      message.warning("Seleccioná al menos un tipo y una forma de pago");
      return;
    }
    onClose();
  };

  return (
    <Modal
      title="Filtros de Búsqueda"
      open={open}
      onCancel={onClose}
      width={320}
      centered
      footer={null}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          paddingTop: "8px",
        }}
      >
        {/* SECCIÓN TIPOS */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Text strong style={{ fontSize: "15px" }}>
              Tipos
            </Text>
            <Space size={8}>
              <Tooltip title="Seleccionar todos">
                <Button
                  type="text"
                  size="small"
                  icon={<MdRestartAlt size={18} style={{ color: "#1890ff" }} />}
                  onClick={() => setTipos(Object.values(MOVIMIENTO_TIPOS))}
                />
              </Tooltip>
              <Tooltip title="Quitar todos">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<MdOutlineLayersClear size={18} />}
                  onClick={() => setTipos([])}
                />
              </Tooltip>
            </Space>
          </div>
          <Space wrap size={[4, 8]}>
            {Object.values(MOVIMIENTO_TIPOS).map((tag) => (
              <CheckableTag
                key={tag}
                checked={tipos.includes(tag)}
                onChange={(c) => handleToggle(tipos, setTipos, tag, c)}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  margin: 0,
                  padding: "6px 12px",
                  fontSize: "14px",
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div>

        {/* SECCIÓN FORMAS DE PAGO */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Text strong style={{ fontSize: "15px" }}>
              Formas de Pago
            </Text>
            <Space size={8}>
              <Tooltip title="Seleccionar todos">
                <Button
                  type="text"
                  size="small"
                  icon={<MdRestartAlt size={18} style={{ color: "#1890ff" }} />}
                  onClick={() => setFormas(NOMBRES_FORMAS_PAGO)}
                />
              </Tooltip>
              <Tooltip title="Quitar todos">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<MdOutlineLayersClear size={18} />}
                  onClick={() => setFormas([])}
                />
              </Tooltip>
            </Space>
          </div>
          <Space wrap size={[4, 8]}>
            {NOMBRES_FORMAS_PAGO.map((tag) => (
              <CheckableTag
                key={tag}
                checked={formas.includes(tag)}
                onChange={(c) => handleToggle(formas, setFormas, tag, c)}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  margin: 0,
                  padding: "6px 12px",
                  fontSize: "14px",
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div>

        {/* ACCIONES FINALES DENTRO DEL BODY */}
        <div style={{ marginTop: "8px" }}>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleConfirmar}
            style={{
              borderRadius: "12px",
              height: "48px",
              fontWeight: "600",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          >
            Ver resultados
          </Button>
          <Button
            type="text"
            block
            onClick={onReset}
            style={{
              color: "#8c8c8c",
              fontSize: "13px",
            }}
          >
            Reestablecer filtros predeterminados
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFiltros;
