import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Typography, Button, Divider, Tag, Empty, Popconfirm, message, Modal,
} from "antd";
import {
  MdArrowBack, MdDeleteOutline, MdOutlineLock,
  MdOutlineAddCircleOutline, MdOutlineAccountBalanceWallet,
  MdClose,
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useNavigate } from "react-router-dom";
import { movimientoService } from "../../../services/movimientoService";
import { cierreService } from "../../../services/cierreService";
import { orgService } from "../../../services/orgService";
import { useAuth } from "../../../context/AuthContext";
import { useCurrentOrg } from "../../../hooks/useCurrentOrg";
import { useCurrentSucursal } from "../../../hooks/useCurrentSucursal";
import { MOVIMIENTO_TIPOS, POS_COLORS } from "../../../constants/posConstants";
import CalculadoraGestion from "../../../components/CalculadoraGestion";

const { Text } = Typography;

const AdminCajaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const orgId = useCurrentOrg();
  const { sucursalId } = useCurrentSucursal();
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
      .filter((m) => {
        if (m.formaPagos?.length > 0) {
          return m.formaPagos.some((fp) => formasImpactanCaja.includes(fp.key)) && (!sucursalId || m.sucursalId === sucursalId);
        }
        return formasImpactanCaja.includes(m.formaPago) && (!sucursalId || m.sucursalId === sucursalId);
      })
      .sort((a, b) => a.id - b.id);
  }, [formasImpactanCaja, refreshKey, sucursalId]);

  const cierres = useMemo(
    () => cierreService.getAll().sort((a, b) => a.id - b.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  );

  // Running balance calculation
  const entries = useMemo(() => {
    const combined = [];

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

    return combined.reverse();
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

  const handleCierreClick = () => {
    Modal.confirm({
      title: "Confirmar Cierre de Caja",
      content: (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <Text style={{ fontSize: "12px", color: "#8c8c8c", display: "block" }}>
            Saldo actual
          </Text>
          <Text
            strong
            style={{
              fontSize: "24px",
              color: saldoActual >= 0 ? "#52c41a" : "#ff4d4f",
            }}
          >
            ${" "}
            {Math.abs(saldoActual).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </div>
      ),
      centered: true,
      okText: "Confirmar",
      cancelText: "Cancelar",
      onOk: handleCierre,
    });
  };

  const handleDeleteCierre = (id) => {
    cierreService.deleteById(id);
    message.success("Cierre eliminado");
  };

  const handleRegistrarMov = () => {
    if (movImporte <= 0) {
      message.warning("Ingrese un importe válido");
      return;
    }
    if (movTipoModal === MOVIMIENTO_TIPOS.RETIRO && movImporte > saldoActual) {
      message.warning("El retiro no puede superar el saldo actual de caja");
      return;
    }
    const movimientoData = {
      tipo: movTipoModal,
      importe: Number(movImporte),
      formaPago: "Efectivo",
      formaPagos: [{ key: "Efectivo", importe: Number(movImporte) }],
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
      {/* Header + acciones */}
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
            Admin Caja
          </Text>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button
            type="text"
            icon={<MdOutlineAddCircleOutline size={24} />}
            style={{ color: "#52c41a", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => {
              setMovTipoModal(MOVIMIENTO_TIPOS.INGRESO);
              setMovImporte(0);
              setMovObservacion("");
              setIsModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<MdOutlineAccountBalanceWallet size={24} />}
            style={{ color: "#546e7a", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => {
              setMovTipoModal(MOVIMIENTO_TIPOS.RETIRO);
              setMovImporte(0);
              setMovObservacion("");
              setIsModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<MdOutlineLock size={24} />}
            style={{ color: "#faad14", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={handleCierreClick}
          />
        </div>
      </div>

      {/* Card saldo */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          marginBottom: "16px",
          border: "1px solid #f0f0f0",
          textAlign: "center",
          padding: "20px",
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
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  border: "none",
                                  margin: 0,
                                  lineHeight: "22px",
                                  padding: "0 8px",
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
                                fontSize: "14px",
                                fontWeight: 700,
                                border: "none",
                                margin: 0,
                                lineHeight: "22px",
                                padding: "0 8px",
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
                              · {(mov.formaPagos ? mov.formaPagos.map(fp => fp.key).join(" + ") : mov.formaPago)}
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
        title={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "Ingreso" : "Retiro"}
        closeIcon={<MdClose size={20} />}
      >
        <CalculadoraGestion
          value={movImporte}
          onChange={setMovImporte}
          accentColor={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#52c41a" : "#546e7a"}
          title={`Saldo actual: $${saldoActual.toLocaleString("es-AR")}`}
          titleColor={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#52c41a" : "#546e7a"}
          titleBg={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#f6ffed" : "#eceff1"}
          titleBorder={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "#b7eb8f" : "#cfd8dc"}
          buttonLabel={movTipoModal === MOVIMIENTO_TIPOS.INGRESO ? "Registrar Ingreso" : "Registrar Retiro"}
          onConfirm={handleRegistrarMov}
          disabled={movTipoModal === MOVIMIENTO_TIPOS.RETIRO ? (movImporte <= 0 || movImporte > saldoActual) : undefined}
          showObservacion
          observacion={movObservacion}
          onObservacionChange={setMovObservacion}
        />
        {movTipoModal === MOVIMIENTO_TIPOS.RETIRO && movImporte > saldoActual && (
          <Text style={{ display: "block", textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#ff4d4f", fontWeight: 600 }}>
            Supera el saldo disponible en caja
          </Text>
        )}
      </Modal>
    </div>
  );
};

export default AdminCajaPage;
