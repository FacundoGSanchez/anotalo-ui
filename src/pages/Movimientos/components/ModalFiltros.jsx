import React from "react";
import {
  Modal,
  Typography,
  Tag,
  Space,
  Divider,
  Button,
  DatePicker,
  Tooltip,
} from "antd";
import { MdRestartAlt, MdOutlineLayersClear } from "react-icons/md";
import dayjs from "dayjs";

const { Text } = Typography;
const { CheckableTag } = Tag;

const ModalFiltros = ({
  open,
  onClose,
  tipos,
  setTipos,
  formas,
  setFormas,
  fecha,
  setFecha,
  onReset,
}) => {
  const formasPagoOpciones = [
    "Efectivo",
    "Debito",
    "Credito",
    "Transferencia",
    "Cta Corriente",
    "QR",
  ];
  const tiposOpciones = ["Venta", "Pago", "Retiro"];

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
      width={320} // Ancho optimizado para mobile
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
            {/* BOTÓN REESTABLECER (ICONO) */}
            <Tooltip title="Reestablecer todo">
              <Button
                type="text"
                danger
                icon={<MdRestartAlt size={22} />}
                onClick={onReset}
              />
            </Tooltip>

            {/* BOTÓN LIMPIAR (ICONO) */}
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
            key="ok"
            type="primary"
            onClick={onClose}
            style={{ borderRadius: "8px" }}
          >
            Ver resultados
          </Button>
        </div>,
      ]}
      centered
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* SECCIÓN TIPOS */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Tipos
          </Text>
          <Space wrap size={[4, 8]}>
            {tiposOpciones.map((tag) => (
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
            {formasPagoOpciones.map((tag) => (
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
                {tag === "Debito"
                  ? "Débito"
                  : tag === "Credito"
                    ? "Crédito"
                    : tag}
              </CheckableTag>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* SECCIÓN FECHA (Solo Input) */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Fecha
          </Text>
          <DatePicker
            style={{ width: "100%" }}
            value={fecha}
            format="DD/MM/YYYY"
            inputReadOnly
            allowClear={false}
            onChange={(d) => d && setFecha(d)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalFiltros;
