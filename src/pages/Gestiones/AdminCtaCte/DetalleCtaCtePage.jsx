import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Divider,
  Tag,
  Empty,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdPayment,
  MdClose,
  MdSettings,
} from "react-icons/md";
import { movimientoService } from "../../../services/movimientoService";
import { entidadService } from "../../../services/entidadService";
import { orgService } from "../../../services/orgService";
import { authService } from "../../../services/authService";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
} from "../../../constants/posConstants";
import { useAuth } from "../../../context/AuthContext";
import CalculadoraGestion from "../../../components/CalculadoraGestion";

const { Text } = Typography;

const PAGE_SIZE = 15;

const DetalleCtaCtePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movTipoModal, setMovTipoModal] = useState(null);
  const [movImporte, setMovImporte] = useState(0);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configForm] = Form.useForm();
  const [modalStep, setModalStep] = useState("amount");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const formasPago = useMemo(() => {
    const orgId = authService.getCurrentOrgId();
    return (orgService.getFormasPago(orgId, "Cobro") || []).filter(
      (fp) => fp.key !== "Cta Corriente",
    );
  }, []);

  const incrementRefresh = useCallback(
    () => setRefreshKey((k) => k + 1),
    [],
  );

  const entidad = useMemo(
    () => entidadService.getById("clientes", id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, refreshKey],
  );

  const ctaCteConfig = entidad?.ctaCteConfig || {};

  const movs = useMemo(() => {
    if (!entidad) return [];
    return movimientoService
      .getAll()
      .filter(
        (m) =>
          m.entidad?.id === entidad.id &&
          (movimientoService.tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO),
      )
      .sort((a, b) => b.id - a.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entidad?.id, refreshKey]);

  const movsVisibles = useMemo(() => {
    return movs.slice(0, visibleCount);
  }, [movs, visibleCount]);

  const handleVerMas = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  const saldo = useMemo(() => {
    if (movs.length === 0) return 0;
    return movs[0].saldoCtaCte || 0;
  }, [movs]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const handler = () => incrementRefresh();
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, [incrementRefresh]);

  const handleRegistrarConForma = (formaPago) => {
    if (movImporte <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    const movimientoData = {
      tipo: movTipoModal,
      importe: Number(movImporte),
      formaPago,
      formaPagos: [{ nombre: formaPago, importe: Number(movImporte) }],
      entidad: { id: entidad.id, nombre: entidad.nombre },
    };
    const result = movimientoService.save(movimientoData, user);
    if (result.success) {
      message.success(`${movTipoModal} registrado correctamente`);
      setIsModalOpen(false);
      setMovImporte(0);
    } else {
      message.error("Error al registrar movimiento");
    }
  };

  const handleRegistrarMov = () => {
    if (movImporte <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    setModalStep("formaPago");
  };

  const abrirModal = (tipoMov) => {
    setMovTipoModal(tipoMov);
    setMovImporte(0);
    setModalStep("amount");
    setIsModalOpen(true);
  };

  const abrirConfigModal = () => {
    configForm.setFieldsValue({
      importeMaximo: ctaCteConfig.importeMaximo || null,
      plazoDias: ctaCteConfig.plazoDias || null,
    });
    setConfigModalOpen(true);
  };

  const guardarConfig = () => {
    configForm.validateFields().then((values) => {
      entidadService.saveCtaCteConfig("clientes", entidad.id, {
        ...ctaCteConfig,
        habilitado: true,
        importeMaximo: values.importeMaximo,
        plazoDias: values.plazoDias,
      });
      message.success("Configuración guardada");
      setConfigModalOpen(false);
      incrementRefresh();
    });
  };

  if (!entidad) {
    return (
      <div
        style={{
          padding: "16px",
          maxWidth: "600px",
          margin: "0 auto",
          background: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Button
          type="text"
          icon={<MdArrowBack size={24} />}
          onClick={() => navigate("/gestiones/ctacte")}
        />
        <Empty description="Entidad no encontrada" />
      </div>
    );
  }

  const esPositivo = (mov) =>
    mov.tipo === MOVIMIENTO_TIPOS.COBRO || mov.tipo === MOVIMIENTO_TIPOS.PAGO;

  const sobreLimite =
    ctaCteConfig.habilitado &&
    ctaCteConfig.importeMaximo &&
    saldo > ctaCteConfig.importeMaximo;

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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            type="text"
            icon={<MdArrowBack size={24} />}
            onClick={() => navigate("/gestiones/ctacte")}
          />
          <Text strong style={{ fontSize: "18px" }}>
            Detalle Cuenta
          </Text>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            shape="circle"
            icon={<MdSettings size={22} />}
            onClick={abrirConfigModal}
            style={{
              background: "#8c8c8c",
              borderColor: "#8c8c8c",
              width: "42px",
              height: "42px",
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<MdPayment size={22} />}
            onClick={() =>
              abrirModal(MOVIMIENTO_TIPOS.COBRO)
            }
            style={{
              background: "#52c41a",
              borderColor: "#52c41a",
              width: "42px",
              height: "42px",
            }}
          />
        </div>
      </div>

      {/* Saldo card — dos columnas */}
      <div
        style={{
          display: "flex",
          padding: "20px",
          background: "#fff",
          borderRadius: "16px",
          marginBottom: "16px",
          border: "1px solid #f0f0f0",
          gap: "16px",
        }}
      >
        {/* Izquierda — datos */}
        <div
          style={{
            flex: "0 0 auto",
            maxWidth: "55%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "6px",
            borderRight: "1px solid #f0f0f0",
            paddingRight: "16px",
          }}
        >
          <Text
            strong
            style={{
              fontSize: "15px",
              color: "#262626",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {entidad.nombre}
          </Text>
          <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
            Tope: ${(ctaCteConfig.importeMaximo || 0).toLocaleString("es-AR")}
          </Text>
          <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
            Plazo: {ctaCteConfig.plazoDias || 0} días
          </Text>
        </div>

        {/* Derecha — saldo */}
        <div
          style={{
            flex: 1,
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
            SALDO CUENTA
          </Text>
          <Text
            strong
            style={{
              fontSize: "28px",
              color: saldo >= 0 ? "#ff4d4f" : "#52c41a",
              display: "block",
            }}
          >
            ${" "}
            {Math.abs(saldo).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text
            type="secondary"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: saldo >= 0 ? "#ff4d4f" : "#52c41a",
              display: "block",
            }}
          >
            {saldo === 0
              ? "Saldo en cero"
              : saldo > 0
                ? `Nos debe $${Math.abs(saldo).toLocaleString("es-AR")}`
                : `A favor $${Math.abs(saldo).toLocaleString("es-AR")}`}
          </Text>
          {sobreLimite && (
            <Text
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#ff4d4f",
                display: "block",
                marginTop: "4px",
              }}
            >
              Superó límite de $
              {Number(ctaCteConfig.importeMaximo).toLocaleString("es-AR")}
            </Text>
          )}
        </div>
      </div>

      {/* Movement list */}
      {movs.length === 0 ? (
        <div style={{ marginTop: "40px" }}>
          <Empty description="Sin movimientos" />
        </div>
      ) : (
        <div>
          <Text
            type="secondary"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              display: "block",
              marginBottom: "8px",
              paddingLeft: "4px",
            }}
          >
            ÚLTIMOS MOVIMIENTOS
          </Text>
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
            }}
          >
            {movsVisibles.map((mov, i) => (
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
                        color={POS_COLORS[mov.tipo]}
                        style={{
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "none",
                          margin: 0,
                          lineHeight: "18px",
                          padding: "0 6px",
                        }}
                      >
                        {mov.tipo === MOVIMIENTO_TIPOS.VENTA
                          ? "V"
                          : mov.tipo === MOVIMIENTO_TIPOS.PAGO
                            ? "P"
                            : mov.tipo === MOVIMIENTO_TIPOS.COBRO
                              ? "C"
                              : "I"}
                      </Tag>
                      <Text style={{ fontSize: "13px", color: "#595959" }}>
                        {mov.tipo}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {(() => { const { fecha, hora } = movimientoService.extraerFechaHora(mov.fechaRegistro); return `${fecha} ${hora} hs`; })()}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <Text
                        strong
                        style={{
                          fontSize: "15px",
                          color: esPositivo(mov) ? "#52c41a" : "#ff4d4f",
                        }}
                      >
                        {esPositivo(mov) ? "+" : "-"}$
                        {(() => {
                          const ctaCteImporte = movimientoService.getCtaCteImporte(mov);
                          return (ctaCteImporte > 0
                            ? Number(ctaCteImporte)
                            : Number(mov.importe)
                          ).toLocaleString("es-AR");
                        })()}
                      </Text>
                      {movimientoService.tieneCtaCte(mov) &&
                        (() => {
                          const ctaCteImporte = movimientoService.getCtaCteImporte(mov);
                          return ctaCteImporte > 0 && Number(ctaCteImporte) !== Number(mov.importe);
                        })() && (
                          <div style={{ marginTop: "2px" }}>
                            <Text type="secondary" style={{ fontSize: "11px", lineHeight: 1 }}>
                              (Total ${Number(mov.importe).toLocaleString("es-AR")})
                            </Text>
                          </div>
                        )}
                    </div>
                    <Popconfirm
                      title="¿Eliminar movimiento?"
                      onConfirm={() => {
                        movimientoService.deleteById(mov.id);
                        message.success("Movimiento eliminado");
                      }}
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
                {i < movsVisibles.length - 1 && (
                  <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />
                )}
              </div>
            ))}
          </div>

          {movs.length > visibleCount && (
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <Button
                type="text"
                onClick={handleVerMas}
                style={{ color: "#eb2f96", fontWeight: 600, fontSize: "13px" }}
              >
                + Ver más ({movs.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal COBRO — 2 pasos: importe → forma de pago */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setMovImporte(0);
          setModalStep("amount");
        }}
        footer={null}
        width={360}
        centered
        title={modalStep === "amount" ? "Registrar Cobro" : "Forma de pago"}
        closeIcon={<MdClose size={20} />}
      >
        {modalStep === "amount" ? (
          <CalculadoraGestion
            value={movImporte}
            onChange={setMovImporte}
            accentColor="#52c41a"
            title={`Saldo cta cte: $${saldo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
            titleColor={saldo >= 0 ? "#ff4d4f" : "#52c41a"}
            titleBg={saldo >= 0 ? "#fff2f0" : "#f6ffed"}
            titleBorder={saldo >= 0 ? "#ffccc7" : "#b7eb8f"}
            buttonLabel="Continuar"
            onConfirm={handleRegistrarMov}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {/* Importe a cobrar */}
            <div
              style={{
                textAlign: "center",
                padding: "8px 0 12px",
              }}
            >
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Importe a cobrar
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

            {/* Opciones de forma de pago */}
            {formasPago.map((fp) => (
              <div
                key={fp.key}
                role="button"
                tabIndex={0}
                onClick={() => handleRegistrarConForma(fp.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRegistrarConForma(fp.key);
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
              onClick={() => setModalStep("amount")}
            >
              ← Atrás
            </Button>
          </div>
        )}
      </Modal>

      {/* Config modal */}
      <Modal
        open={configModalOpen}
        onCancel={() => setConfigModalOpen(false)}
        onOk={guardarConfig}
        okText="Guardar"
        cancelText="Cancelar"
        title={<div style={{ lineHeight: 1.4 }}>Configuración Cta Cte<div style={{ fontSize: "13px", fontWeight: 400, color: "#8c8c8c" }}>{entidad.nombre}</div></div>}
        centered
      >
        <Form form={configForm} layout="vertical">
          <Form.Item
            name="importeMaximo"
            label="Tope Cuenta Corriente"
            rules={[{ required: true, message: "Indicá el tope máximo" }]}
          >
            <Input type="number" inputMode="numeric" placeholder="Ej: 50000"
              size="large" style={{ padding: "12px", borderRadius: "8px" }} />
          </Form.Item>
          <Form.Item
            name="plazoDias"
            label="Plazo (días)"
            rules={[{ required: true, message: "Indicá el plazo en días" }]}
          >
            <Input type="number" inputMode="numeric" placeholder="Ej: 30"
              size="large" style={{ padding: "12px", borderRadius: "8px" }} suffix="días" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetalleCtaCtePage;
