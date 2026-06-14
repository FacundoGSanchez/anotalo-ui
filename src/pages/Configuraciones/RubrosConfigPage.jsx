import { useState, useEffect, useCallback } from "react";
import { Typography, Button, Modal, Input, Popconfirm, message, Divider } from "antd";
import { MdArrowBack, MdAdd, MdRestore, MdChevronRight, MdClose, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { orgService } from "../../services/orgService";
import { useCurrentOrg } from "../../hooks/useCurrentOrg";
import { RUBROS_DEFAULT } from "../../constants/posConstants";

const { Text } = Typography;

const RubrosConfigPage = () => {
  const navigate = useNavigate();
  const orgId = useCurrentOrg();
  const [rubros, setRubros] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formSigla, setFormSigla] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formGrupo, setFormGrupo] = useState("");

  const loadRubros = useCallback(() => {
    setRubros(orgService.getRubros(orgId));
  }, [orgId]);

  useEffect(() => {
    loadRubros();
  }, [loadRubros]);

  const openAdd = () => {
    setEditItem(null);
    setFormSigla("");
    setFormNombre("");
    setFormGrupo("General");
    setModalOpen(true);
  };

  const openEdit = (rubro) => {
    setEditItem(rubro);
    setFormSigla(rubro.sigla);
    setFormNombre(rubro.nombre);
    setFormGrupo(rubro.grupo);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formSigla.trim() || !formNombre.trim() || !formGrupo.trim()) {
      message.warning("Completá todos los campos");
      return;
    }
    let nuevos;
    if (editItem) {
      nuevos = rubros.map((r) =>
        r.id === editItem.id ? { ...r, sigla: formSigla.trim(), nombre: formNombre.trim(), grupo: formGrupo.trim() } : r,
      );
    } else {
      const nuevoId = Date.now();
      nuevos = [...rubros, { id: nuevoId, sigla: formSigla.trim(), nombre: formNombre.trim(), grupo: formGrupo.trim() }];
    }
    setRubros(nuevos);
    orgService.saveRubros(orgId, nuevos);
    setModalOpen(false);
    message.success(editItem ? "Rubro actualizado" : "Rubro agregado");
  };

  const handleDelete = (id) => {
    const nuevos = rubros.filter((r) => r.id !== id);
    setRubros(nuevos);
    orgService.saveRubros(orgId, nuevos);
    message.success("Rubro eliminado");
  };

  const handleResetDefault = () => {
    setRubros(RUBROS_DEFAULT);
    orgService.saveRubros(orgId, RUBROS_DEFAULT);
    message.success("Rubros restaurados a valores por defecto");
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button type="text" icon={<MdArrowBack size={24} />} onClick={() => navigate(-1)} />
          <Text strong style={{ fontSize: "18px" }}>Rubros</Text>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Popconfirm title="¿Restaurar rubros por defecto?" onConfirm={handleResetDefault} okText="Sí" cancelText="No">
            <Button size="small" icon={<MdRestore size={16} />} style={{ borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
          </Popconfirm>
          <Button type="primary" icon={<MdAdd size={18} />} onClick={openAdd} style={{ borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        {rubros.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Text type="secondary">Sin rubros configurados</Text>
          </div>
        ) : (
          rubros.map((r, idx) => (
              <div key={r.id}>
                <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }} onClick={() => openEdit(r)}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#1890ff12", color: "#1890ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "14px", flexShrink: 0, marginRight: "12px",
                }}>
                  {r.sigla}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: "14px", display: "block" }}>{r.nombre}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>{r.grupo}</Text>
                </div>
                <Button type="text" icon={<MdChevronRight size={20} />} style={{ color: "#8c8c8c", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              {idx < rubros.length - 1 && <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />}
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title={editItem ? "Editar rubro" : "Nuevo rubro"} centered width={360} closeIcon={<MdClose size={20} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>SIGLA</Text>
            <Input value={formSigla} onChange={(e) => setFormSigla(e.target.value.toUpperCase().slice(0, 3))} placeholder="Ej: V" maxLength={3} style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>NOMBRE</Text>
            <Input value={formNombre} onChange={(e) => setFormNombre(e.target.value)} placeholder="Ej: Varios" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>GRUPO</Text>
            <Input value={formGrupo} onChange={(e) => setFormGrupo(e.target.value)} placeholder="Ej: General" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {editItem && (
              <Popconfirm title="¿Eliminar rubro?" onConfirm={() => { handleDelete(editItem.id); setModalOpen(false); }} okText="Sí" cancelText="No" okButtonProps={{ danger: true }}>
                <Button danger icon={<MdDelete size={18} />} style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </Popconfirm>
            )}
            <Button type="primary" onClick={handleSave} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "15px", fontWeight: 700 }}>
              {editItem ? "Guardar cambios" : "Agregar rubro"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RubrosConfigPage;
