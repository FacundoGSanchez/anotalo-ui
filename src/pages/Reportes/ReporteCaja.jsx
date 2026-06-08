import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Typography, Button, Divider, Tag, Empty, Popconfirm, message, Modal, Row, Col,
} from "antd";
import {
  MdArrowBack, MdMoreHoriz, MdDeleteOutline, MdOutlineLock,
  MdOutlineAddCircleOutline, MdOutlineAccountBalanceWallet,
  MdOutlineBackspace, MdClose,
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useNavigate } from "react-router-dom";
import { movimientoService } from "../../services/movimientoService";
import { cierreService } from "../../services/cierreService";
import { orgService } from "../../services/orgService";
import { useAuth } from "../../context/AuthContext";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../constants/posConstants";

const { Text } = Typography;

const BOTONES_TECLADO = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"];

const ReporteCaja = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const orgId = session?.organizaciones?.[0]?.id;
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movTipoModal, setMovTipoModal] = useState(null);
  const [movImporte, setMovImporte] = useState(0);
  const [movObservacion, setMovObservacion] = useState("");

  const incrementRefresh = useCallback(
    () => setRefreshKey((k) => k + 1),
    [],
  );

  useEffect(() => {
    const handler = () => incrementRefresh();
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, [incrementRefresh]);

  const formasImpactanCaja = useMemo(() => {
    const fps = orgService.getFormasPago(orgId, MOVIMIENTO_TIPOS.VENTA);
    return fps.filter((fp) => fp.impactaCaja).map((fp) => fp.key);
  }, [orgId, refreshKey]);

  const movsCaja = useMemo(() => {
    if (formasImpactanCaja.length === 0) return [];
    return movimientoService
      .getAll()
      .filter((m) => formasImpactanCaja.includes(m.formaPago))
      .sort((a, b) => a.id - b.id);
  }, [formasImpactanCaja, refreshKey]);

  const cierres = useMemo(
    () => cierreService.getAll().sort((a, b) => a.id - b.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  );

  // Running balance calculation
  const entries = useMemo(() => {
    const combined = [];

    // Merge movs and cierres sorted by id
    let mi = 0;
    let ci = 0;
    let balance = 0;

    while (mi < movsCaja.length || ci < cierres.length) {
      const mov = movsCaja[mi];
      const cierre = cierres[ci];

      if (cierre && (!mov || cierre.id < mov.id)) {
        combined.push({ type: "cierre", data: cierre, balance });
        ci++;
      } else if (mov) {
        const importe = Number(mov.importe) || 0;
        const esEntrada =
          mov.tipo === MOVIMIENTO_TIPOS.VENTA ||
          mov.tipo === MOVIMIENTO_TIPOS.INGRESO ||
          mov.tipo === MOVIMIENTO_TIPOS.COBRO;
        balance += esEntrada ? importe : -importe;
        combined.push({ type: "mov", data: mov, balance });
        mi++;
      } else {
        combined.push({ type: "cierre", data: cierres[ci], balance });
        ci++;
      }
    }

    return combined.reverse(); // newest first
  }, [movsCaja, cierres]);

  const saldoActual = entries.length > 0 ? entries[0].balance : 0;

  const handleCierre = () => {
    const result = cierreService.save(saldoActual, user);
    if (result.success) {
      message.success(`Cierre registrado: $${saldoActual.toLocaleString("es-AR")}`);
    } else {
      message.error("Error al registrar cierre");
    }
  };

  const handleDeleteCierre = (id) => {
    cierreService.deleteById(id);
    message.success("Cierre eliminado");
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

  const handleRegistrarMov = () => {
    if (movImporte <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    const movimientoData = {
      tipo: movTipoModal,
      importe: Number(movImporte),
      formaPago: "Efectivo",
      entidad: { id: 0, nombre: "Caja Interna" },
      observacion: movObservacion,
    };
    const result = movimientoService.save(movimientoData, user);
    if (result.success) {
      message.success(`${movTipoModal} registrado correctamente`);
      setIsModalOpen(false);
      setMovImporte(0);
      setMovObservacion("");
    } else {
      message.error("Error al registrar movimiento");
    }
  };

  // Group entries by date
  const grouped = useMemo(() => {
    const groups = {};
    entries.forEach((entry) => {
      const date =
        entry.type === "mov"
          ? entry.data.fecha
          : entry.data.fecha || "Sin fecha";
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [entries]);

  const fechas = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

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
            onClick={() => navigate(-1)}
          />
          <Text strong style={{ fontSize: "18px" }}>
            Administrar Caja
          </Text>
        </div>
        <Button
          type="text"
          icon={<MdMoreHoriz size={22} />}
          style={{ color: "#8c8c8c" }}
        />
      </div>

      {/* Acciones rápidas: Ingreso / Egreso manual */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <Button
          block
          size="large"
          icon={<MdOutlineAddCircleOutline size={22} />}
          onClick={() => {
            setMovTipoModal(MOVIMIENTO_TIPOS.INGRESO);
            setMovImporte(0);
            setMovObservacion("");
            setIsModalOpen(true);
          }}
          style={{
            borderRadius: "12px",
            height: "52px",
            fontSize: "14px",
            fontWeight: 700,
            background: "#52c41a",
            borderColor: "#52c41a",
            color: "#fff",
          }}
        >
          Ingreso Manual
        </Button>
        <Button
          block
          size="large"
          icon={<MdOutlineAccountBalanceWallet size={22} />}
          onClick={() => {
            setMovTipoModal(MOVIMIENTO_TIPOS.RETIRO);
            setMovImporte(0);
            setMovObservacion("");
            setIsModalOpen(true);
          }}
          style={{
            borderRadius: "12px",
            height: "52px",
            fontSize: "14px",
            fontWeight: 700,
            background: "#546e7a",
            borderColor: "#546e7a",
            color: "#fff",
          }}
        >
          Egreso Manual
        </Button>
      </div>

      {/* Saldo actual + botón cierre */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#fff",
          borderRadius: "16px",
          marginBottom: "16px",
          border: "1px solid #f0f0f0",
        }}
      >
        <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
          SALDO DE CAJA
        </Text>
        <Text
          strong
          style={{
            fontSize: "32px",
            color: saldoActual >= 0 ? "#52c41a" : "#ff4d4f",
          }}
        >
          ${" "}
          {Math.abs(saldoActual).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Button
          type="primary"
          block
          icon={<MdOutlineLock size={16} />}
          onClick={handleCierre}
          style={{
            marginTop: "12px",
            borderRadius: "10px",
            height: "38px",
            fontSize: "13px",
            fontWeight: 700,
            background: "#52c41a",
            borderColor: "#52c41a",
          }}
        >
          Registrar Cierre
        </Button>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div style={{ marginTop: "60px" }}>
          <Empty description="Sin movimientos de caja" />
        </div>
      ) : (
        <div>
          {fechas.map((fecha) => (
            <div key={fecha} style={{ marginBottom: "20px" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  paddingLeft: "4px",
                }}
              >
                {fecha === dayjs().format("YYYY-MM-DD")
                  ? "Hoy"
                  : dayjs(fecha).locale("es").format("DD [de] MMMM")}
              </Text>

              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #f0f0f0",
                  overflow: "hidden",
                }}
              >
                {grouped[fecha].map((entry, i) => {
                  const items = grouped[fecha];
                  if (entry.type === "cierre") {
                    const c = entry.data;
                    return (
                      <div key={`cierre-${c.id}`}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 14px",
                            background: "#fffbe6",
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
                                color="#faad14"
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
                                C
                              </Tag>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  color: "#595959",
                                }}
                              >
                                Cierre
                              </Text>
                            </div>
                            <Text
                              type="secondary"
                              style={{ fontSize: "11px" }}
                            >
                              {c.fecha} {c.hora} hs · {c.usuario}
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
                                color: "#d48806",
                              }}
                            >
                              ${" "}
                              {Math.abs(c.saldo).toLocaleString("es-AR")}
                            </Text>
                            <Popconfirm
                              title="¿Eliminar cierre?"
                              onConfirm={() => handleDeleteCierre(c.id)}
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
                        {i < items.length - 1 && (
                          <Divider
                            style={{
                              margin: "0",
                              borderColor: "#f0f0f0",
                            }}
                          />
                        )}
                      </div>
                    );
                  }

                  const mov = entry.data;
                  const esEntrada =
                    mov.tipo === MOVIMIENTO_TIPOS.VENTA ||
                    mov.tipo === MOVIMIENTO_TIPOS.INGRESO ||
                    mov.tipo === MOVIMIENTO_TIPOS.COBRO;

                  return (
                    <div key={`mov-${mov.id}`}>
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
                                  : mov.tipo === MOVIMIENTO_TIPOS.INGRESO
                                    ? "I"
                                    : "R"}
                            </Tag>
                            <Text
                              style={{
                                fontSize: "13px",
                                color: "#595959",
                              }}
                            >
                              {mov.tipo}
                            </Text>
                            <Text
                              type="secondary"
                              style={{ fontSize: "11px" }}
                            >
                              · {mov.formaPago}
                            </Text>
                          </div>
                          <Text
                            type="secondary"
                            style={{ fontSize: "11px" }}
                          >
                            {mov.fecha} {mov.hora} hs · {mov.usuario}
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
                              color: esEntrada ? "#52c41a" : "#ff4d4f",
                            }}
                          >
                            {esEntrada ? "+" : "-"}$
                            {Number(mov.importe).toLocaleString("es-AR")}
                          </Text>
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
                      {i < items.length - 1 && (
                        <Divider
                          style={{
                            margin: "0",
                            borderColor: "#f0f0f0",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ingreso/Egreso manual */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setMovImporte(0);
          setMovObservacion("");
        }}
        footer={null}
        width={360}
        centered
        title={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "Ingreso Manual" : "Egreso Manual"}
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
          {/* Saldo actual */}
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              background: "#f6ffed",
              borderRadius: "8px",
              border: "1px solid #b7eb8f",
            }}
          >
            <Text style={{ fontSize: "12px", color: "#52c41a" }}>
              Saldo actual: ${saldoActual.toLocaleString("es-AR")}
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

          {/* Botón registrar */}
          <Button
            type="primary"
            block
            size="large"
            disabled={movImporte <= 0}
            onClick={handleRegistrarMov}
            style={{
              marginTop: "4px",
              height: "48px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              background: movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#52c41a" : "#546e7a",
              borderColor: movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#52c41a" : "#546e7a",
            }}
          >
            Registrar {movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "Ingreso" : "Egreso"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ReporteCaja;
