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
} from "antd";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdPayment,
} from "react-icons/md";
import { movimientoService } from "../../services/movimientoService";
import { entidadService } from "../../services/entidadService";
import {
  MOVIMIENTO_TIPOS,
  POS_COLORS,
} from "../../constants/posConstants";

const { Text } = Typography;

const TIPO_ENTIDAD = { CLIENTES: "clientes", PROVEEDORES: "proveedores" };

const DetalleCtaCtePage = () => {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const incrementRefresh = useCallback(
    () => setRefreshKey((k) => k + 1),
    [],
  );

  const entidad = useMemo(
    () => entidadService.getById(tipo, id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tipo, id, refreshKey],
  );

  const ctaCteConfig = entidad?.ctaCteConfig || {};

  const movs = useMemo(() => {
    if (!entidad) return [];
    return movimientoService
      .getAll()
      .filter(
        (m) =>
          m.entidad?.id === entidad.id && m.formaPago === "Cta Corriente",
      )
      .sort((a, b) => b.id - a.id)
      .slice(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entidad?.id, refreshKey]);

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
          onClick={() => navigate("/reportes/ctacte")}
        />
        <Empty description="Entidad no encontrada" />
      </div>
    );
  }

  const esPositivo = (mov) => {
    if (tipo === TIPO_ENTIDAD.CLIENTES) {
      return mov.tipo === MOVIMIENTO_TIPOS.COBRO || mov.tipo === MOVIMIENTO_TIPOS.PAGO;
    }
    return mov.tipo === MOVIMIENTO_TIPOS.VENTA;
  };

  const esCliente = tipo === TIPO_ENTIDAD.CLIENTES;
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
            onClick={() => navigate("/reportes/ctacte")}
          />
          <Text strong style={{ fontSize: "18px" }}>
            {entidad.nombre}
          </Text>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <Button
            type="text"
            icon={<MdPayment size={20} />}
            style={{ color: "#52c41a", fontSize: "20px" }}
            onClick={() =>
              navigate("/pos/anotalo", {
                state: {
                  tipoDirecto: esCliente ? MOVIMIENTO_TIPOS.COBRO : MOVIMIENTO_TIPOS.PAGO,
                  entidadPreseleccionada: entidad,
                  skipFirstStep: true,
                  returnPath: window.location.pathname,
                },
              })
            }
          />
        </div>
      </div>

      {/* Saldo card */}
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
          SALDO ACTUAL
        </Text>
        <Text
          strong
          style={{
            fontSize: "32px",
            color: saldo >= 0 ? "#ff4d4f" : "#52c41a",
          }}
        >
          ${" "}
          {Math.abs(saldo).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </Text>

        {/* Leyenda nos debe / les debemos */}
        <div style={{ marginTop: "6px" }}>
          <Text
            type="secondary"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: saldo >= 0 ? "#ff4d4f" : "#52c41a",
            }}
          >
            {saldo === 0
              ? "Saldo en cero"
              : esCliente
                ? saldo > 0
                  ? `Nos debe $${Math.abs(saldo).toLocaleString("es-AR")}`
                  : `A favor $${Math.abs(saldo).toLocaleString("es-AR")}`
                : saldo > 0
                  ? `Les debemos $${Math.abs(saldo).toLocaleString("es-AR")}`
                  : `A favor $${Math.abs(saldo).toLocaleString("es-AR")}`}
          </Text>
        </div>

        {sobreLimite && (
          <div style={{ marginTop: "6px" }}>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#ff4d4f",
              }}
            >
              Superó el límite de $
              {Number(ctaCteConfig.importeMaximo).toLocaleString("es-AR")}
            </Text>
          </div>
        )}

        {ctaCteConfig.habilitado && ctaCteConfig.plazoDias && (
          <div style={{ marginTop: "2px" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Vencimiento: {ctaCteConfig.plazoDias} días
            </Text>
          </div>
        )}
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
            {movs.map((mov, i) => (
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
                      {mov.fecha} {mov.hora} hs
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
                        color: esPositivo(mov) ? "#52c41a" : "#ff4d4f",
                      }}
                    >
                      {esPositivo(mov) ? "+" : "-"}$
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
                {i < movs.length - 1 && (
                  <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleCtaCtePage;
