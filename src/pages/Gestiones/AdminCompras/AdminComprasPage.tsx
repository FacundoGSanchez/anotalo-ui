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
} from "antd";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdClose,
  MdPayment,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { movimientoService } from "../../../services/movimientoService";
import { entidadService } from "../../../services/entidadService";
import { orgService } from "../../../services/orgService";
import { useAuth } from "../../../context/AuthContext";
import { useCurrentOrg } from "../../../hooks/useCurrentOrg";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";
import CalculadoraGestion from "../../../components/CalculadoraGestion";
import type { Entity, Movimiento, FormaPagoItem } from "@/types";

const { Text } = Typography;

const PAGE_SIZE = 15;

type RegisterStep = "proveedor" | "importe" | "formaPago";

const AdminComprasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const orgId = useCurrentOrg();
  const [refreshKey, setRefreshKey] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>("proveedor");
  const [selectedProveedor, setSelectedProveedor] = useState<Entity | null>(null);
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
      .sort((a, b) => {
        const fA = movimientoService.extraerFechaHora(a.fechaRegistro);
        const fB = movimientoService.extraerFechaHora(b.fechaRegistro);
        return (fB.fecha + fB.hora).localeCompare(fA.fecha + fA.hora);
      });
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

  const handleSelectProveedor = (prov: Entity) => {
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

  const handleRegistrarPago = (formaPago: string) => {
    if (!selectedProveedor) {
      message.warning("Seleccione un proveedor");
      return;
    }
    const movimientoData = {
      tipo: MOVIMIENTO_TIPOS.PAGO as "Pago",
      importe: Number(movImporte),
      formaPago,
      formaPagos: [{ nombre: formaPago, importe: Number(movImporte) }],
      entidad: { id: selectedProveedor.id, nombre: selectedProveedor.nombre, activo: true },
      observacion: "",
    };
    const result = movimientoService.save(movimientoData, user ? { id: user.id, nombre: user.nombre } : {});    if (result.success) {
      message.success("Pago registrado correctamente");
      closeRegisterModal();
    } else {
      message.error("Error al registrar pago");
    }
  };

  const handleDeleteMov = (id: number) => {
    movimientoService.deleteById(id);
    message.success("Pago eliminado");
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<MdArrowBack size={24} />}
            onClick={() => navigate(-1)}
            style={{ marginRight: "12px" }}
          />
          <Text strong style={{ fontSize: "18px" }}>
            Pago a Proveedores
          </Text>
        </div>
        <Button
          type="primary"
          shape="circle"
          icon={<MdPayment size={22} />}
          onClick={openRegisterModal}
          style={{
            background: POS_COLORS[MOVIMIENTO_TIPOS.PAGO],
            borderColor: POS_COLORS[MOVIMIENTO_TIPOS.PAGO],
            width: "42px",
            height: "42px",
          }}
        />
      </div>

      {/* Buscador por proveedor */}
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
                  }}
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
                      {(() => { const { fecha } = movimientoService.extraerFechaHora(mov.fechaRegistro); return fecha; })()} · {(mov.formaPagos ? mov.formaPagos.map(fp => fp.nombre || fp.key).join(" + ") : mov.formaPago)}
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
                    <Popconfirm
                      title="¿Eliminar pago?"
                      onConfirm={() => handleDeleteMov(mov.id)}
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
            title={selectedProveedor?.nombre || null}
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
                  e.currentTarget.style.borderColor = fp.color || "#f0f0f0";
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${fp.color || "#1890ff"}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = fp.color || "#f0f0f0";
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${fp.color || "#1890ff"}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Text strong style={{ fontSize: "16px", color: "#262626" }}>
                  {fp.label?.toUpperCase()}
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

export default AdminComprasPage;
