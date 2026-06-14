import { useState, useEffect, useCallback } from "react";
import { Typography, Button, Modal, Input, Checkbox, Popconfirm, message, Divider } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { MdArrowBack, MdAdd, MdChevronRight, MdClose, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../services/usuarioService";
import { sucursalService } from "../../services/sucursalService";

const { Text } = Typography;

const UsuariosConfigPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formSucursales, setFormSucursales] = useState([]);

  const loadData = useCallback(() => {
    setUsuarios(usuarioService.getAll());
    setSucursales(sucursalService.getAll());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAdd = () => {
    setEditItem(null);
    setFormUsername("");
    setFormPassword("");
    setFormNombre("");
    setFormSucursales([]);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditItem(u);
    setFormUsername(u.username);
    setFormPassword("");
    setFormNombre(u.nombre);
    setFormSucursales(u.sucursales?.map((s) => s.id) || []);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formUsername.trim() || !formNombre.trim()) {
      message.warning("Completá nombre de usuario y nombre");
      return;
    }
    if (!editItem && !formPassword.trim()) {
      message.warning("La contraseña es obligatoria");
      return;
    }
    const sucursalesSel = sucursales.filter((s) => formSucursales.includes(s.id)).map((s) => ({ id: s.id, nombre: s.nombre }));
    const payload = {
      username: formUsername.trim(),
      nombre: formNombre.trim(),
      sucursales: sucursalesSel,
    };
    if (formPassword.trim()) payload.password = formPassword.trim();
    let result;
    if (editItem) {
      result = usuarioService.update(editItem.id, payload);
    } else {
      result = usuarioService.create({ ...payload, password: formPassword.trim() });
    }
    if (result === null) {
      message.error("El nombre de usuario ya existe");
      return;
    }
    loadData();
    setModalOpen(false);
    message.success(editItem ? "Usuario actualizado" : "Usuario creado");
  };

  const handleDelete = (id) => {
    usuarioService.deleteById(id);
    loadData();
    message.success("Usuario eliminado");
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button type="text" icon={<MdArrowBack size={24} />} onClick={() => navigate(-1)} />
          <Text strong style={{ fontSize: "18px" }}>Usuarios</Text>
        </div>
        <Button type="primary" icon={<MdAdd size={18} />} onClick={openAdd} style={{ borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }} />
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        {usuarios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Text type="secondary">Sin usuarios configurados</Text>
          </div>
        ) : (
          usuarios.map((u, idx) => (
            <div key={u.id}>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }} onClick={() => openEdit(u)}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#722ed112", color: "#722ed1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "14px", flexShrink: 0, marginRight: "12px",
                }}>
                  {u.nombre.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: "14px", display: "block" }}>{u.nombre}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>{u.username} &middot; {u.sucursales?.length || 0} sucursal(es)</Text>
                </div>
                <Button type="text" icon={<MdChevronRight size={20} />} style={{ color: "#8c8c8c", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              {idx < usuarios.length - 1 && <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />}
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title={editItem ? "Editar usuario" : "Nuevo usuario"} centered width={400} closeIcon={<MdClose size={20} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>USUARIO</Text>
            <Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="Ej: vendedor1" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>NOMBRE</Text>
            <Input value={formNombre} onChange={(e) => setFormNombre(e.target.value)} placeholder="Ej: Juan Pérez" style={{ borderRadius: "10px", height: "44px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>{editItem ? "NUEVA CONTRASEÑA (dejar vacío para no cambiar)" : "CONTRASEÑA"}</Text>
            <Input.Password value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" style={{ borderRadius: "10px", height: "44px" }} iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>SUCURSALES ASIGNADAS</Text>
            <div style={{ maxHeight: "180px", overflowY: "auto", border: "1px solid #f0f0f0", borderRadius: "10px", padding: "4px 0" }}>
              {sucursales.length === 0 ? (
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: "13px" }}>No hay sucursales disponibles</Text>
                </div>
              ) : (
                sucursales.map((s) => {
                  const checked = formSucursales.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      style={{ display: "flex", alignItems: "center", padding: "8px 12px", cursor: "pointer", borderRadius: "6px", transition: "background 0.15s" }}
                      onClick={() => setFormSucursales(prev => checked ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Checkbox checked={checked} />
                      <span style={{ marginLeft: "10px", fontSize: "14px" }}>{s.nombre}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {editItem && (
              <Popconfirm title="¿Eliminar usuario?" onConfirm={() => { handleDelete(editItem.id); setModalOpen(false); }} okText="Sí" cancelText="No" okButtonProps={{ danger: true }}>
                <Button danger icon={<MdDelete size={18} />} style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </Popconfirm>
            )}
            <Button type="primary" onClick={handleSave} style={{ flex: 1, height: "48px", borderRadius: "12px", fontSize: "15px", fontWeight: 700 }}>
              {editItem ? "Guardar cambios" : "Agregar usuario"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsuariosConfigPage;
