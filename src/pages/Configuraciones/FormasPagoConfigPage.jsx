import { useState, useEffect, useCallback } from "react";
import { Typography, Button, Modal, Input, Switch, Popconfirm, message, Divider } from "antd";
import { MdArrowBack, MdAdd, MdRestore, MdChevronRight, MdClose, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { orgService } from "../../services/orgService";
import { useCurrentOrg } from "../../hooks/useCurrentOrg";
import { FORMAS_PAGO_DEFAULT } from "../../constants/posConstants";

const { Text } = Typography;

const FormasPagoConfigPage = () => {
  const navigate = useNavigate();
  const orgId = useCurrentOrg();
  const [formasPago, setFormasPago] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formSigla, setFormSigla] = useState("");
  const [formReqEnt, setFormReqEnt] = useState(false);
  const [formImpCaja, setFormImpCaja] = useState(false);
  const [formImpCtaCte, setFormImpCtaCte] = useState(false);

  const loadFormas = useCallback(() => {
    const config = orgService.getConfig(orgId);
    const fps = config.formasPago?.Venta;
    setFormasPago(fps && fps.length > 0 ? fps : []);
  }, [orgId]);

  useEffect(() => {
    loadFormas();
  }, [loadFormas]);

  const saveFormas = (nuevas) => {
    const config = orgService.getConfig(orgId);
    config.formasPago = { ...(config.formasPago || {}), Venta: nuevas };
    orgService.saveConfig(orgId, config);
    setFormasPago(nuevas);
  };

  const handleResetDefault = () => {
    saveFormas(FORMAS_PAGO_DEFAULT);
    message.success("Formas de pago restauradas a valores por defecto");
  };

  const openAdd = () => {
    setEditItem(null);
    setFormNombre("");
    setFormSigla("");
    setFormReqEnt(false);
    setFormImpCaja(false);
    setFormImpCtaCte(false);
    setModalOpen(true);
  };

  const openEdit = (fp) => {
    setEditItem(fp);
    setFormNombre(fp.nombre);
    setFormSigla(fp.sigla);
    setFormReqEnt(fp.requiereEntidad);
    setFormImpCaja(fp.impactaCaja);
    setFormImpCtaCte(fp.impactaCtaCte);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formNombre.trim() || !formSigla.trim()) {
      message.warning("Completá nombre y sigla");
      return;
    }
    let nuevas;
    if (editItem) {
      nuevas = formasPago.map((fp) =>
        fp.id === editItem.id
          ? { ...fp, nombre: formNombre.trim(), sigla: formSigla.trim(), requiereEntidad: formReqEnt, impactaCaja: formImpCaja, impactaCtaCte: formImpCtaCte }
          : fp,
      );
    } else {
      nuevas = [...formasPago, { id: Date.now(), nombre: formNombre.trim(), sigla: formSigla.trim(), requiereEntidad: formReqEnt, impactaCaja: formImpCaja, impactaCtaCte: formImpCtaCte }];
    }
    saveFormas(nuevas);
    setModalOpen(false);
    message.success(editItem ? "Forma de pago actualizada" : "Forma de pago agregada");
  };

  const handleDelete = (id) => {
    const nuevas = formasPago.filter((fp) => fp.id !== id);
    saveFormas(nuevas);
    message.success("Forma de pago eliminada");
  };

  const toggleProp = (id, prop, value) => {
    const nuevas = formasPago.map((fp) => (fp.id === id ? { ...fp, [prop]: value } : fp));
    saveFormas(nuevas);
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button type="text" icon={<MdArrowBack size={24} />} onClick={() => navigate(-1)} />
          <Text strong style={{ fontSize: "18px" }}>Formas de Pago</Text>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Popconfirm title="¿Restaurar formas de pago por defecto?" onConfirm={handleResetDefault} okText="Sí" cancelText="No">
            <Button size="small" icon={<MdRestore size={16} />} style={{ borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
          </Popconfirm>
          <Button type="primary" icon={<MdAdd size={18} />} onClick={openAdd} style={{ borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {formasPago.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0" }}>
            <Text type="secondary">Sin formas de pago configuradas</Text>
          </div>
        ) : (
          formasPago.map((fp) => (
            <CardFormaPago
              key={fp.id}
              data={fp}
              onEdit={() => openEdit(fp)}
              onDelete={() => handleDelete(fp.id)}
              onToggle={(prop, value) => toggleProp(fp.id, prop, value)}
            />
          ))
        )}
      </div>

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title={editItem ? "Editar forma de pago" : "Nueva forma de pago"} centered width={360} closeIcon={<MdClose size={20} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>NOMBRE</Text>
            <Input value={formNombre} onChange={(e) => setFormNombre(e.target.value)} placeholder="Ej: Efectivo" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>SIGLA</Text>
            <Input value={formSigla} onChange={(e) => setFormSigla(e.target.value.slice(0, 5))} placeholder="Ej: Efe" maxLength={5} style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <Divider style={{ margin: "4px 0" }} />
          <ToggleRow label="Requiere entidad" value={formReqEnt} onChange={setFormReqEnt} desc="Obliga a seleccionar un cliente" />
          <ToggleRow label="Impacta caja" value={formImpCaja} onChange={setFormImpCaja} desc="Afecta el saldo de caja física" />
          <ToggleRow label="Impacta cta cte" value={formImpCtaCte} onChange={setFormImpCtaCte} desc="Afecta la cuenta corriente" />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {editItem && (
              <Popconfirm title="¿Eliminar forma de pago?" onConfirm={() => { handleDelete(editItem.id); setModalOpen(false); }} okText="Sí" cancelText="No" okButtonProps={{ danger: true }}>
                <Button danger icon={<MdDelete size={18} />} style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </Popconfirm>
            )}
            <Button type="primary" onClick={handleSave} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "15px", fontWeight: 700 }}>
              {editItem ? "Guardar cambios" : "Agregar forma de pago"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const CardFormaPago = ({ data, onEdit, onDelete, onToggle }) => (
  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "16px", cursor: "pointer" }} onClick={onEdit}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
      <div>
        <Text strong style={{ fontSize: "15px" }}>{data.nombre}</Text>
        <Text type="secondary" style={{ fontSize: "12px", marginLeft: "8px" }}>({data.sigla})</Text>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        <Button type="text" icon={<MdChevronRight size={20} />} style={{ color: "#8c8c8c", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
      <MiniSwitch label="Requiere entidad" value={data.requiereEntidad} onChange={(v) => onToggle("requiereEntidad", v)} />
      <MiniSwitch label="Impacta caja" value={data.impactaCaja} onChange={(v) => onToggle("impactaCaja", v)} />
      <MiniSwitch label="Impacta cta cte" value={data.impactaCtaCte} onChange={(v) => onToggle("impactaCtaCte", v)} />
    </div>
  </div>
);

const MiniSwitch = ({ label, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <Switch size="small" checked={value} onChange={onChange} />
    <Text style={{ fontSize: "11px", color: "#8c8c8c" }}>{label}</Text>
  </div>
);

const ToggleRow = ({ label, value, onChange, desc }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <Text style={{ fontSize: "13px", fontWeight: 600 }}>{label}</Text>
      {desc && <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>{desc}</Text>}
    </div>
    <Switch checked={value} onChange={onChange} />
  </div>
);

export default FormasPagoConfigPage;
