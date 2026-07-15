import { useState, useEffect, useCallback } from "react";
import { Typography, Button, Modal, Input, Popconfirm, message, Divider } from "antd";
import { MdArrowBack, MdAdd, MdChevronRight, MdClose, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { sucursalService } from "../../services/sucursalService";
import { usuarioService } from "../../services/usuarioService";

const { Text } = Typography;

const SucursalesConfigPage = () => {
  const navigate = useNavigate();
  const [sucursales, setSucursales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formNombre, setFormNombre] = useState("");

  const loadSucursales = useCallback(() => {
    setSucursales(sucursalService.getAll());
  }, []);

  useEffect(() => {
    loadSucursales();
  }, [loadSucursales]);

  const openAdd = () => {
    setEditItem(null);
    setFormNombre("");
    setModalOpen(true);
  };

  const openEdit = (suc) => {
    setEditItem(suc);
    setFormNombre(suc.nombre);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formNombre.trim()) {
      message.warning("Completá el nombre");
      return;
    }
    if (editItem) {
      sucursalService.update(editItem.id, { nombre: formNombre.trim() });
    } else {
      sucursalService.create({ nombre: formNombre.trim() });
    }
    loadSucursales();
    setModalOpen(false);
    message.success(editItem ? "Sucursal actualizada" : "Sucursal agregada");
  };

  const handleDelete = (id) => {
    const usuarios = usuarioService.getAll();
    const asignada = usuarios.some((u) => u.sucursales?.some((s) => s.id === id));
    if (asignada) {
      message.error("No se puede eliminar: hay usuarios asignados a esta sucursal");
      return;
    }
    const ok = sucursalService.deleteById(id);
    if (!ok) {
      message.warning("No se puede eliminar la única sucursal");
      return;
    }
    loadSucursales();
    message.success("Sucursal eliminada");
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button type="text" icon={<MdArrowBack size={24} />} onClick={() => navigate(-1)} />
          <Text strong style={{ fontSize: "18px" }}>Sucursales</Text>
        </div>
        <Button type="primary" icon={<MdAdd size={18} />} onClick={openAdd} style={{ borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        {sucursales.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Text type="secondary">Sin sucursales configuradas</Text>
          </div>
        ) : (
          sucursales.map((s, idx) => (
            <div key={s.id}>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }} onClick={() => openEdit(s)}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#52c41a12", color: "#52c41a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "14px", flexShrink: 0, marginRight: "12px",
                }}>
                  {s.nombre.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: "14px", display: "block" }}>{s.nombre}</Text>
                </div>
                <Button type="text" icon={<MdChevronRight size={20} />} style={{ color: "#8c8c8c", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              {idx < sucursales.length - 1 && <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />}
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title={editItem ? "Editar sucursal" : "Nueva sucursal"} centered width={360} closeIcon={<MdClose size={20} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>NOMBRE</Text>
            <Input value={formNombre} onChange={(e) => setFormNombre(e.target.value)} placeholder="Ej: Sucursal Centro" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {editItem && (
              <Popconfirm title="¿Eliminar sucursal?" onConfirm={() => { handleDelete(editItem.id); setModalOpen(false); }} okText="Sí" cancelText="No" okButtonProps={{ danger: true }}>
                <Button danger icon={<MdDelete size={18} />} style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </Popconfirm>
            )}
            <Button type="primary" onClick={handleSave} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "15px", fontWeight: 700 }}>
              {editItem ? "Guardar cambios" : "Agregar sucursal"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SucursalesConfigPage;
