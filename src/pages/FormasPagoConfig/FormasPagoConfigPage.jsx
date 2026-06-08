import { useState, useEffect } from "react";
import {
  Typography, Button, Switch, Tabs, message, Card, Select,
  Modal, Input, Popconfirm,
} from "antd";
import {
  MdArrowBack, MdSave, MdBusiness, MdDeleteOutline, MdEdit, MdClose, MdAdd,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { orgService } from "../../services/orgService";
import { useAuth } from "../../context/AuthContext";
import { FORMAS_PAGO, MOVIMIENTO_TIPOS } from "../../constants/posConstants";

const { Text } = Typography;

const TIPOS = [MOVIMIENTO_TIPOS.VENTA, MOVIMIENTO_TIPOS.PAGO, MOVIMIENTO_TIPOS.COBRO];

const FormasPagoConfigPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const orgs = session?.organizaciones || [];
  const [orgId, setOrgId] = useState(orgs[0]?.id || null);
  const [tab, setTab] = useState(TIPOS[0]);
  const [formas, setFormas] = useState([]);
  const [dirty, setDirty] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addKey, setAddKey] = useState("");
  const [addLabel, setAddLabel] = useState("");

  const [editKey, setEditKey] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const orgActual = orgs.find((o) => o.id === orgId);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const cargarFormas = () => {
    if (!orgId) return;
    const config = orgService.getConfig(orgId);
    const raw = config.formasPago?.[tab] || [];
    if (raw.length > 0) {
      setFormas(raw);
    } else {
      setFormas(FORMAS_PAGO.map((fp) => ({
        key: fp.key,
        label: fp.label,
        enabled: true,
        requiereEntidad: fp.requiereEntidad,
        impactaCaja: fp.impactaCaja,
        impactaCtaCte: fp.impactaCtaCte,
      })));
    }
    setDirty(false);
  };

  useEffect(() => {
    cargarFormas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, tab]);

  const toggleProp = (key, prop) => {
    setFormas((prev) =>
      prev.map((f) => (f.key === key ? { ...f, [prop]: !f[prop] } : f)),
    );
    setDirty(true);
  };

  const toggleEnabled = (key) => {
    setFormas((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)),
    );
    setDirty(true);
  };

  const handleSave = () => {
    orgService.saveFormasPago(orgId, tab, formas);
    message.success("Formas de pago guardadas");
    setDirty(false);
  };

  const handleAdd = () => {
    const key = addKey.trim();
    const label = addLabel.trim() || key;
    if (!key) {
      message.warning("Ingrese un identificador");
      return;
    }
    if (formas.some((f) => f.key === key)) {
      message.warning("Ya existe una forma de pago con ese identificador");
      return;
    }
    setFormas((prev) => [
      ...prev,
      {
        key,
        label,
        enabled: true,
        requiereEntidad: false,
        impactaCaja: false,
        impactaCtaCte: false,
      },
    ]);
    setDirty(true);
    setAddOpen(false);
    setAddKey("");
    setAddLabel("");
  };

  const handleDelete = (key) => {
    setFormas((prev) => prev.filter((f) => f.key !== key));
    setDirty(true);
  };

  const handleRename = (key) => {
    setFormas((prev) =>
      prev.map((f) => (f.key === key ? { ...f, label: editLabel.trim() || f.label } : f)),
    );
    setDirty(true);
    setEditKey(null);
    setEditLabel("");
  };

  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "600px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            type="text"
            icon={<MdArrowBack size={24} />}
            onClick={() => navigate("/more")}
          />
          <Text strong style={{ fontSize: "18px" }}>
            Formas de Pago
          </Text>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {dirty && (
            <Button
              type="primary"
              icon={<MdSave size={18} />}
              onClick={handleSave}
              style={{
                borderRadius: "10px",
                height: "38px",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Guardar
            </Button>
          )}
        </div>
      </div>

      {/* Selector de organización */}
      {orgs.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
            padding: "10px 14px",
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
        >
          <MdBusiness size={18} style={{ color: "#8c8c8c", flexShrink: 0 }} />
          <Select
            value={orgId}
            onChange={(val) => setOrgId(val)}
            style={{ flex: 1, borderRadius: "8px" }}
            size="large"
            options={orgs.map((o) => ({
              value: o.id,
              label: o.nombre,
            }))}
          />
        </div>
      )}

      {orgs.length === 1 && (
        <Text
          type="secondary"
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "12px",
            paddingLeft: "4px",
          }}
        >
          {orgActual?.nombre}
        </Text>
      )}

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={TIPOS.map((t) => ({
          key: t,
          label: t === MOVIMIENTO_TIPOS.PAGO ? "Pago (Proveedores)" : t === MOVIMIENTO_TIPOS.COBRO ? "Cobro (Clientes)" : t,
          children: (
            <div>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px", marginBottom: "14px", paddingLeft: "4px" }}
              >
                {t === MOVIMIENTO_TIPOS.VENTA
                  ? "Personalizá las formas de cobro disponibles para las ventas a clientes."
                  : t === MOVIMIENTO_TIPOS.PAGO
                    ? "Personalizá las formas de pago disponibles para pagos a proveedores."
                    : "Personalizá las formas de cobro disponibles para cobros a clientes."}
              </Text>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {formas.map((fp) => (
                  <Card
                    key={fp.key}
                    styles={{ body: { padding: "14px 16px" } }}
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #f0f0f0",
                      opacity: fp.enabled ? 1 : 0.4,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {editKey === fp.key ? (
                          <Input
                            size="small"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onPressEnter={() => handleRename(fp.key)}
                            onBlur={() => handleRename(fp.key)}
                            style={{ width: "160px", borderRadius: "6px" }}
                            autoFocus
                          />
                        ) : (
                          <>
                            <Text strong style={{ fontSize: "15px" }}>
                              {fp.label}
                            </Text>
                            <Button
                              type="text"
                              size="small"
                              icon={<MdEdit size={14} />}
                              style={{ color: "#8c8c8c" }}
                              onClick={() => {
                                setEditKey(fp.key);
                                setEditLabel(fp.label);
                              }}
                            />
                          </>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Switch
                          checked={fp.enabled}
                          onChange={() => toggleEnabled(fp.key)}
                          size="small"
                        />
                        <Popconfirm
                          title={`¿Eliminar "${fp.label}"?`}
                          onConfirm={() => handleDelete(fp.key)}
                          okText="Sí"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<MdDeleteOutline size={16} />}
                          />
                        </Popconfirm>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { key: "requiereEntidad", label: "Requiere entidad" },
                        { key: "impactaCaja", label: "Impacta en caja" },
                        { key: "impactaCtaCte", label: "Impacta en Cta. Cte." },
                      ].map((prop) => (
                        <div
                          key={prop.key}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            type="secondary"
                            style={{ fontSize: "13px", color: "#595959" }}
                          >
                            {prop.label}
                          </Text>
                          <Switch
                            checked={fp[prop.key]}
                            onChange={() => toggleProp(fp.key, prop.key)}
                            size="small"
                            disabled={!fp.enabled}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="primary"
                shape="circle"
                icon={<MdAdd size={20} />}
                onClick={() => setAddOpen(true)}
                style={{
                  marginTop: "16px",
                  boxShadow: "0 4px 10px rgba(24, 144, 255, 0.3)",
                }}
              />
            </div>
          ),
        }))}
        style={{ marginBottom: "12px" }}
      />

      {/* Modal Agregar */}
      <Modal
        open={addOpen}
        onCancel={() => {
          setAddOpen(false);
          setAddKey("");
          setAddLabel("");
        }}
        footer={null}
        width={360}
        centered
        title="Nueva forma de pago"
        closeIcon={<MdClose size={20} />}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}
            >
              Identificador
            </Text>
            <Input
              placeholder="ej: Mercado Pago"
              value={addKey}
              onChange={(e) => setAddKey(e.target.value)}
              style={{ borderRadius: "8px", height: "42px" }}
            />
          </div>
          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}
            >
              Nombre visible
            </Text>
            <Input
              placeholder="Si se deja vacío, usa el identificador"
              value={addLabel}
              onChange={(e) => setAddLabel(e.target.value)}
              style={{ borderRadius: "8px", height: "42px" }}
            />
          </div>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleAdd}
            style={{
              marginTop: "4px",
              height: "44px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            Agregar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FormasPagoConfigPage;
