import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Tag,
  Empty,
  Popconfirm,
  message,
  Modal,
  Input,
  Tabs,
} from "antd";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdClose,
  MdChevronRight,
  MdShoppingCart,
  MdAssignment,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { movimientoService } from "../../../services/movimientoService";
import { entidadService } from "../../../services/entidadService";
import { orgService } from "../../../services/orgService";
import { useAuth } from "../../../context/AuthContext";
import { useCurrentOrg } from "../../../hooks/useCurrentOrg";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";
import CalculadoraGestion from "../../../components/CalculadoraGestion";

const { Text } = Typography;

const PAGE_SIZE = 15;

const AdminComprasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const orgId = useCurrentOrg();
  const [refreshKey, setRefreshKey] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState(null);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState("proveedor");
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [movImporte, setMovImporte] = useState(0);
  const [proveedorBusqueda, setProveedorBusqueda] = useState("");

  const incrementRefresh = useCallback(
    () => setRefreshKey((k) => k + 1),
    [],
  );

  useEffect(() => {
    const handler = () => incrementRefresh();
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, [incrementRefresh]);

  const formasPago = useMemo(() => {
    return (orgService.getFormasPago(orgId, MOVIMIENTO_TIPOS.PAGO) || []).filter(
      (fp) => fp.key !== "Cta Corriente",
    );
  }, [orgId, refreshKey]);

  const proveedores = useMemo(() => {
    return entidadService.getActivos("proveedores") || [];
  }, [refreshKey]);

  const proveedoresFiltrados = useMemo(() => {
    if (!proveedorBusqueda.trim()) return proveedores;
    const q = proveedorBusqueda.trim().toLowerCase();
    return proveedores.filter((p) =>
      p.nombre?.toLowerCase().includes(q),
    );
  }, [proveedores, proveedorBusqueda]);

  const allPagos = useMemo(() => {
    return movimientoService
      .getAll()
      .filter((m) => m.tipo === MOVIMIENTO_TIPOS.PAGO)
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }, [refreshKey]);

  const pagosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return allPagos;
    const q = busqueda.trim().toLowerCase();
    return allPagos.filter((m) =>
      m.entidad?.nombre?.toLowerCase().includes(q),
    );
  }, [allPagos, busqueda]);

  const pagosVisibles = useMemo(() => {
    return pagosFiltrados.slice(0, visibleCount);
  }, [pagosFiltrados, visibleCount]);

  const handleVerMas = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  const openDetailModal = (mov) => {
    setSelectedMov(mov);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedMov(null);
    setDetailModalOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterStep("proveedor");
    setSelectedProveedor(null);
    setMovImporte(0);
    setProveedorBusqueda("");
    setRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
    setRegisterStep("proveedor");
    setSelectedProveedor(null);
    setMovImporte(0);
    setProveedorBusqueda("");
  };

  const handleSelectProveedor = (prov) => {
    setSelectedProveedor(prov);
    setRegisterStep("importe");
  };

  const handleContinuarImporte = () => {
    if (movImporte <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    setRegisterStep("formaPago");
  };

  const handleRegistrarPago = (formaPago) => {
    if (!selectedProveedor) {
      message.warning("Seleccione un proveedor");
      return;
    }
    const movimientoData = {
      tipo: MOVIMIENTO_TIPOS.PAGO,
      importe: Number(movImporte),
      formaPago,
      formaPagos: [{ key: formaPago, importe: Number(movImporte) }],
      entidad: { id: selectedProveedor.id, nombre: selectedProveedor.nombre },
      observacion: "",
    };
    const result = movimientoService.save(movimientoData, user);
    if (result.success) {
      message.success("Pago registrado correctamente");
      closeRegisterModal();
    } else {
      message.error("Error al registrar pago");
    }
  };

  const handleEditMovImporte = (nuevoImporte) => {
    if (!selectedMov) return;
    movimientoService.update(selectedMov.id, { importe: Number(nuevoImporte) });
    message.success("Importe actualizado");
    closeDetailModal();
  };

  const handleEditFormaPago = (nuevaForma) => {
    if (!selectedMov) return;
    movimientoService.update(selectedMov.id, {
      formaPago: nuevaForma,
      formaPagos: [{ key: nuevaForma, importe: Number(selectedMov.importe) || 0 }],
    });
    message.success("Forma de pago actualizada");
    closeDetailModal();
  };

  const handleDeleteMov = (id) => {
    movimientoService.deleteById(id);
    message.success("Pago eliminado");
  };

  const pagosTab = (
    <div>
      {/* Buscador */}
      <div style={{ marginBottom: "12px" }}>
        <Input.Search
          placeholder="Buscar por proveedor..."
          allowClear
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          style={{ borderRadius: "10px" }}
        />
      </div>

      {/* Botón registrar pago */}
      <Button
        type="primary"
        block
        icon={<MdShoppingCart size={18} />}
        onClick={openRegisterModal}
        style={{
          borderRadius: "10px",
          height: "44px",
          fontSize: "14px",
          fontWeight: 700,
          marginBottom: "16px",
          background: "#fa8c16",
          borderColor: "#fa8c16",
        }}
      >
        Registrar Pago
      </Button>

      {/* Listado */}
      {pagosVisibles.length === 0 ? (
        <div style={{ marginTop: "40px" }}>
          <Empty description="Sin pagos registrados" />
        </div>
      ) : (
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
            }}
          >
            {pagosVisibles.map((mov, i) => (
              <div key={mov.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => openDetailModal(mov)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <Tag
                        color={POS_COLORS[MOVIMIENTO_TIPOS.PAGO]}
                        style={{
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontWeight: 700,
                          border: "none",
                          margin: 0,
                          lineHeight: "22px",
                          padding: "0 8px",
                        }}
                      >
                        P
                      </Tag>
                      <Text
                        style={{
                          fontSize: "13px",
                          color: "#595959",
                          fontWeight: 600,
                        }}
                      >
                        {mov.entidad?.nombre || "Proveedor"}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {mov.fecha} · {(mov.formaPagos ? mov.formaPagos.map(fp => fp.key).join(" + ") : mov.formaPago)}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: "15px",
                        color: "#ff4d4f",
                      }}
                    >
                      -$
                      {Number(mov.importe).toLocaleString("es-AR")}
                    </Text>
                    <MdChevronRight size={18} color="#bfbfbf" />
                  </div>
                </div>
                {i < pagosVisibles.length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      background: "#f0f0f0",
                      margin: "0 14px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {pagosFiltrados.length > visibleCount && (
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <Button
                type="text"
                onClick={handleVerMas}
                style={{ color: "#fa8c16", fontWeight: 600, fontSize: "13px" }}
              >
                + Ver más ({pagosFiltrados.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const pedidosTab = (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "48px", color: "#fa8c16", marginBottom: "16px" }}>
        <MdAssignment />
      </div>
      <Text
        strong
        style={{
          fontSize: "16px",
          display: "block",
          color: "#262626",
          marginBottom: "8px",
        }}
      >
        Pedidos
      </Text>
      <Text type="secondary">
        Gestión de pedidos a proveedores, valores y pendientes de pago — próximamente
      </Text>
    </div>
  );

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Button
          type="text"
          icon={<MdArrowBack size={24} />}
          onClick={() => navigate(-1)}
          style={{ marginRight: "12px" }}
        />
        <MdShoppingCart size={24} color="#fa8c16" style={{ marginRight: "8px" }} />
        <Text strong style={{ fontSize: "18px" }}>
          Gestión de Compras
        </Text>
      </div>

      <Tabs
        defaultActiveKey="pagos"
        items={[
          {
            key: "pagos",
            label: "Pagos",
            children: pagosTab,
          },
          {
            key: "pedidos",
            label: "Pedidos",
            children: pedidosTab,
          },
        ]}
        style={{ background: "transparent" }}
      />

      {/* Modal detalle del pago */}
      <Modal
        open={detailModalOpen}
        onCancel={closeDetailModal}
        footer={null}
        width={360}
        centered
        title="Detalle del Pago"
        closeIcon={<MdClose size={20} />}
      >
        {selectedMov && (
          <DetailContent
            mov={selectedMov}
            formasPago={formasPago}
            onEditImporte={handleEditMovImporte}
            onEditFormaPago={handleEditFormaPago}
            onDelete={() => {
              handleDeleteMov(selectedMov.id);
              closeDetailModal();
            }}
          />
        )}
      </Modal>

      {/* Modal registrar pago — wizard */}
      <Modal
        open={registerModalOpen}
        onCancel={closeRegisterModal}
        footer={null}
        width={360}
        centered
        title={
          registerStep === "proveedor"
            ? "Seleccionar Proveedor"
            : registerStep === "importe"
              ? "Ingresar Importe"
              : "Forma de Pago"
        }
        closeIcon={<MdClose size={20} />}
      >
        {registerStep === "proveedor" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            <Input.Search
              placeholder="Buscar proveedor..."
              allowClear
              value={proveedorBusqueda}
              onChange={(e) => setProveedorBusqueda(e.target.value)}
              style={{ marginBottom: "8px", borderRadius: "10px" }}
            />
            {proveedoresFiltrados.length === 0 ? (
              <Empty description="Sin proveedores" />
            ) : (
              proveedoresFiltrados.map((prov) => (
                <div
                  key={prov.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectProveedor(prov)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectProveedor(prov);
                    }
                  }}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    background: "#fff",
                    cursor: "pointer",
                    padding: "12px 16px",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#fa8c16";
                    e.currentTarget.style.boxShadow = "0 0 0 2px #fa8c1620";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                    {prov.nombre}
                  </Text>
                </div>
              ))
            )}
          </div>
        )}

        {registerStep === "importe" && (
          <CalculadoraGestion
            value={movImporte}
            onChange={setMovImporte}
            accentColor="#fa8c16"
            title={selectedProveedor?.nombre}
            titleColor="#d46b08"
            titleBg="#fff7e6"
            titleBorder="#ffd591"
            buttonLabel="Continuar"
            onConfirm={handleContinuarImporte}
          />
        )}

        {registerStep === "formaPago" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {/* Resumen */}
            <div
              style={{
                textAlign: "center",
                padding: "8px 0 12px",
              }}
            >
              <Text type="secondary" style={{ fontSize: "11px" }}>
                {selectedProveedor?.nombre}
              </Text>
              <Text
                strong
                style={{
                  display: "block",
                  fontSize: "26px",
                  color: "#262626",
                }}
              >
                $ {movImporte.toLocaleString("es-AR")}
              </Text>
            </div>

            {/* Opciones forma de pago */}
            {formasPago.map((fp) => (
              <div
                key={fp.key}
                role="button"
                tabIndex={0}
                onClick={() => handleRegistrarPago(fp.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRegistrarPago(fp.key);
                  }
                }}
                style={{
                  borderRadius: "12px",
                  border: "1px solid #f0f0f0",
                  background: "#fff",
                  cursor: "pointer",
                  padding: "10px 16px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = fp.color;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${fp.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = fp.color;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${fp.color}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Text strong style={{ fontSize: "16px", color: "#262626" }}>
                  {fp.label.toUpperCase()}
                </Text>
                <div
                  style={{
                    fontSize: "24px",
                    color: fp.color,
                    backgroundColor: `${fp.color}15`,
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {fp.icon}
                </div>
              </div>
            ))}

            {/* Botón volver */}
            <Button
              type="text"
              block
              style={{
                marginTop: "4px",
                height: "42px",
                borderRadius: "12px",
                color: "#8c8c8c",
              }}
              onClick={() => setRegisterStep("importe")}
            >
              ← Atrás
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const DetailContent = ({ mov, formasPago, onEditImporte, onEditFormaPago, onDelete }) => {
  const [editingFormaPago, setEditingFormaPago] = useState(false);
  const [editImporte, setEditImporte] = useState(Number(mov.importe) || 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
      {/* Proveedor */}
      <div>
        <Text type="secondary" style={{ fontSize: "11px" }}>Proveedor</Text>
        <Text strong style={{ display: "block", fontSize: "16px", color: "#262626" }}>
          {mov.entidad?.nombre || "—"}
        </Text>
      </div>

      {/* Fecha */}
      <div>
        <Text type="secondary" style={{ fontSize: "11px" }}>Fecha de pago</Text>
        <Text strong style={{ display: "block", fontSize: "14px" }}>
          {mov.fecha} {mov.hora} hs
        </Text>
      </div>

      {/* Importe */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: "11px" }}>Importe</Text>
        </div>
        <CalculadoraGestion
          compact
          value={editImporte}
          onChange={(val) => {
            setEditImporte(val);
            onEditImporte(val);
          }}
          accentColor="#fa8c16"
        />
      </div>

      {/* Forma de pago */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: "11px" }}>Forma de pago</Text>
          {!editingFormaPago && (
            <Button type="link" size="small" onClick={() => setEditingFormaPago(true)} style={{ padding: 0, height: "auto", fontSize: "12px" }}>
              Editar
            </Button>
          )}
        </div>
        {editingFormaPago ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
            {formasPago.map((fp) => (
              <div
                key={fp.key}
                role="button"
                tabIndex={0}
                onClick={() => { onEditFormaPago(fp.key); setEditingFormaPago(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onEditFormaPago(fp.key);
                    setEditingFormaPago(false);
                  }
                }}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #f0f0f0",
                  background: "#fff",
                  cursor: "pointer",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  outline: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = fp.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0f0f0"; }}
              >
                <Text style={{ fontSize: "13px", fontWeight: 600 }}>{fp.label}</Text>
                <div style={{ fontSize: "20px", color: fp.color }}>{fp.icon}</div>
              </div>
            ))}
            <Button size="small" onClick={() => setEditingFormaPago(false)} style={{ borderRadius: "8px", fontSize: "12px" }}>
              Cancelar
            </Button>
          </div>
        ) : (
          <Text strong style={{ display: "block", fontSize: "14px" }}>
            {mov.formaPagos ? mov.formaPagos.map(fp => `${fp.key}: $${Number(fp.importe).toLocaleString("es-AR")}`).join(" + ") : mov.formaPago}
          </Text>
        )}
      </div>

      {/* Observación */}
      <div>
        <Text type="secondary" style={{ fontSize: "11px" }}>Observación</Text>
        <Text style={{ display: "block", fontSize: "13px", color: "#595959" }}>
          {mov.observacion || "—"}
        </Text>
      </div>

      {/* Eliminar */}
      <div style={{ marginTop: "8px", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
        <Popconfirm
          title="¿Eliminar este pago?"
          onConfirm={onDelete}
          okText="Sí"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            block
            danger
            icon={<MdDeleteOutline size={16} />}
            style={{ borderRadius: "10px", height: "38px", fontSize: "13px", fontWeight: 600 }}
          >
            Eliminar Pago
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default AdminComprasPage;
