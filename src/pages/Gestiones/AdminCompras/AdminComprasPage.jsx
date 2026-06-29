import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Tag,
  Empty,
  Popconfirm,
  message,
  Modal,
  Row,
  Col,
  Input,
  Tabs,
} from "antd";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdOutlineBackspace,
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

const { Text } = Typography;

const BOTONES_TECLADO = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"];
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

  const handlePressTecla = (val) => {
    if (movImporte.toString().length >= 12) return;
    setMovImporte((prev) => {
      if (val === "00") return prev * 100;
      return prev * 10 + parseInt(val, 10);
    });
  };

  const handleDeleteTecla = () => {
    setMovImporte((prev) => Math.floor(prev / 10));
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
    movimientoService.update(selectedMov.id, { formaPago: nuevaForma });
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
                      {mov.fecha} · {mov.formaPago}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            {/* Proveedor seleccionado */}
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: "#fff7e6",
                borderRadius: "8px",
                border: "1px solid #ffd591",
              }}
            >
              <Text style={{ fontSize: "12px", color: "#d46b08" }}>
                {selectedProveedor?.nombre}
              </Text>
            </div>

            {/* Visor importe */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "8px 16px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                border: "1px solid #f0f0f0",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: movImporte > 0 ? "28px" : "22px",
                  color: movImporte > 0 ? "#262626" : "#bfbfbf",
                  letterSpacing: "-1px",
                }}
              >
                $ {movImporte.toLocaleString("es-AR")}
              </Text>
            </div>

            {/* Teclado numérico */}
            <Row gutter={[6, 6]}>
              {BOTONES_TECLADO.map((btn) => (
                <Col span={8} key={btn}>
                  <Button
                    block
                    style={{
                      height: "48px",
                      fontSize: "22px",
                      borderRadius: "12px",
                      background: "#fff",
                      fontWeight: 500,
                      border: "1px solid #f0f0f0",
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePressTecla(btn)}
                  >
                    {btn}
                  </Button>
                </Col>
              ))}
              <Col span={8}>
                <Button
                  block
                  type="text"
                  danger
                  style={{
                    height: "48px",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={handleDeleteTecla}
                >
                  <MdOutlineBackspace />
                </Button>
              </Col>
            </Row>

            {/* Botón continuar */}
            <Button
              type="primary"
              block
              size="large"
              disabled={movImporte <= 0}
              onClick={handleContinuarImporte}
              style={{
                marginTop: "4px",
                height: "48px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                background: "#fa8c16",
                borderColor: "#fa8c16",
              }}
            >
              Continuar
            </Button>
          </div>
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
  const [editing, setEditing] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editImporte, setEditImporte] = useState(Number(mov.importe) || 0);
  const [importeBuffer, setImporteBuffer] = useState(0);

  const handleStartEditImporte = () => {
    setImporteBuffer(0);
    setEditImporte(Number(mov.importe) || 0);
    setEditField("importe");
  };

  const handlePressTeclaEdit = (val) => {
    if (importeBuffer.toString().length >= 12) return;
    setImporteBuffer((prev) => {
      if (val === "00") return prev * 100;
      return prev * 10 + parseInt(val, 10);
    });
  };

  const handleDeleteTeclaEdit = () => {
    setImporteBuffer((prev) => Math.floor(prev / 10));
  };

  const handleSaveImporte = () => {
    if (importeBuffer <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    onEditImporte(importeBuffer);
  };

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
          {!editing && (
            <Button type="link" size="small" onClick={handleStartEditImporte} style={{ padding: 0, height: "auto", fontSize: "12px" }}>
              Editar
            </Button>
          )}
        </div>
        {editField === "importe" ? (
          <div style={{ marginTop: "4px" }}>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "4px 12px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                border: "1px solid #f0f0f0",
                marginBottom: "6px",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: importeBuffer > 0 ? "24px" : "18px",
                  color: importeBuffer > 0 ? "#262626" : "#bfbfbf",
                }}
              >
                $ {(importeBuffer > 0 ? importeBuffer : editImporte).toLocaleString("es-AR")}
              </Text>
            </div>
            <Row gutter={[4, 4]}>
              {BOTONES_TECLADO.map((btn) => (
                <Col span={8} key={btn}>
                  <Button
                    block
                    style={{ height: "38px", fontSize: "18px", borderRadius: "8px", background: "#fff", border: "1px solid #f0f0f0" }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePressTeclaEdit(btn)}
                  >
                    {btn}
                  </Button>
                </Col>
              ))}
              <Col span={8}>
                <Button
                  block
                  type="text"
                  danger
                  style={{ height: "38px", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={handleDeleteTeclaEdit}
                >
                  <MdOutlineBackspace />
                </Button>
              </Col>
            </Row>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <Button
                type="primary"
                size="small"
                disabled={importeBuffer <= 0}
                onClick={handleSaveImporte}
                style={{ flex: 1, borderRadius: "8px", fontSize: "12px", fontWeight: 700, background: "#fa8c16", borderColor: "#fa8c16" }}
              >
                Guardar
              </Button>
              <Button
                size="small"
                onClick={() => setEditField(null)}
                style={{ flex: 1, borderRadius: "8px", fontSize: "12px" }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Text strong style={{ display: "block", fontSize: "18px", color: "#ff4d4f" }}>
            -${editImporte.toLocaleString("es-AR")}
          </Text>
        )}
      </div>

      {/* Forma de pago */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: "11px" }}>Forma de pago</Text>
          {!editing && (
            <Button type="link" size="small" onClick={() => { setEditing(true); setEditField("formaPago"); }} style={{ padding: 0, height: "auto", fontSize: "12px" }}>
              Editar
            </Button>
          )}
        </div>
        {editField === "formaPago" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
            {formasPago.map((fp) => (
              <div
                key={fp.key}
                role="button"
                tabIndex={0}
                onClick={() => { onEditFormaPago(fp.key); setEditField(null); setEditing(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onEditFormaPago(fp.key);
                    setEditField(null);
                    setEditing(false);
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
            <Button size="small" onClick={() => { setEditField(null); setEditing(false); }} style={{ borderRadius: "8px", fontSize: "12px" }}>
              Cancelar
            </Button>
          </div>
        ) : (
          <Text strong style={{ display: "block", fontSize: "14px" }}>
            {mov.formaPago}
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
