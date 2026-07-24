import { useState, useMemo, useEffect } from "react";
import { Typography, Card, Input, Empty, Button, Switch } from "antd";
import { MdArrowBack, MdSearch, MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { movimientoService } from "../../../services/movimientoService";
import { entidadService } from "../../../services/entidadService";
import { MOVIMIENTO_TIPOS } from "../../../constants/posConstants";
import type { Entity } from "@/types";

const { Text } = Typography;

interface CtaCteConfig {
  habilitado?: boolean;
  importeMaximo?: number;
  plazoDias?: number;
}

interface SaldoItem {
  entidad: Entity;
  debe: number;
  haber: number;
  saldo: number;
  sobreLimite: boolean;
  plazoVencido: boolean;
}

const calcularSaldos = (): SaldoItem[] => {
  const movs = movimientoService.getAll().filter(
    (m) => movimientoService.tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO,
  );

  const entidadIds = [...new Set(movs.map((m) => m.entidad?.id).filter(Boolean))] as number[];
  const entidades = entidadIds
    .map((id) => entidadService.getById("clientes", id))
    .filter(Boolean) as Entity[];

  const saldos: Record<number, { entidad: Entity; debe: number; haber: number }> = {};

  entidades.forEach((e) => {
    saldos[e.id] = { entidad: e, debe: 0, haber: 0 };
  });

  movs.forEach((m) => {
    const entId = m.entidad?.id;
    if (!entId || !saldos[entId]) return;
    if (m.tipo === MOVIMIENTO_TIPOS.VENTA) {
      saldos[entId].debe += Number(movimientoService.getCtaCteImporte(m)) || 0;
    } else if (m.tipo === MOVIMIENTO_TIPOS.COBRO || m.tipo === MOVIMIENTO_TIPOS.PAGO) {
      saldos[entId].haber += Number(m.importe) || 0;
    }
  });

  return Object.values(saldos)
    .map((s) => ({
      ...s,
      saldo: s.debe - s.haber,
      sobreLimite: (s.entidad.ctaCteConfig as CtaCteConfig | undefined)?.importeMaximo
        ? Math.abs(s.debe - s.haber) > (s.entidad.ctaCteConfig as CtaCteConfig).importeMaximo!
        : false,
      plazoVencido: (() => {
        const ctaCfg = s.entidad.ctaCteConfig as CtaCteConfig | undefined;
        const plazo = ctaCfg?.plazoDias;
        if (!plazo) return false;
        const entMovs = movs.filter((m) => m.entidad?.id === s.entidad.id);
        if (entMovs.length === 0) return false;
        const fechas = entMovs.map((m) => {
          const { fecha } = movimientoService.extraerFechaHora(m.fechaRegistro);
          return dayjs(fecha);
        });
        const masAntigua = fechas.reduce((a, b) => (a.isBefore(b) ? a : b));
        return dayjs().diff(masAntigua, "day") > plazo;
      })(),
    }))
    .sort((a, b) => b.saldo - a.saldo);
};

const AdminCtaCtePage = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("local-db-update", handler);
    return () => window.removeEventListener("local-db-update", handler);
  }, []);

  const saldos = useMemo(() => calcularSaldos(), [refreshKey]);

  const filtrados = useMemo(() => {
    let base = saldos;
    if (soloPendientes) base = base.filter((s) => s.saldo > 0);
    if (!busqueda.trim()) return base;
    const q = busqueda.trim().toLowerCase();
    return base.filter((s) =>
      s.entidad.nombre.toLowerCase().includes(q),
    );
  }, [saldos, busqueda, soloPendientes]);

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
          marginBottom: "16px",
        }}
      >
        <Button
          type="text"
          icon={<MdArrowBack size={24} />}
          onClick={() => navigate("/")}
        />
        <Text strong style={{ fontSize: "18px" }}>
          Cuentas Corrientes
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Text type="secondary" style={{ fontSize: "13px" }}>
          Solo pendientes
        </Text>
        <Switch
          checked={soloPendientes}
          onChange={(v) => setSoloPendientes(v)}
        />
      </div>

      <Input
        placeholder="Buscar por nombre..."
        prefix={<MdSearch size={18} style={{ color: "#bfbfbf" }} />}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        allowClear
        style={{
          borderRadius: "10px",
          marginBottom: "12px",
          height: "42px",
          border: "1px solid #e8e8e8",
          background: "#fff",
        }}
      />

      {filtrados.length === 0 ? (
        <div style={{ marginTop: "60px" }}>
          <Empty description="Sin saldos pendientes" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtrados.map((s) => {
            const saldoDisplay = -s.saldo;

            return (
              <Card
                key={s.entidad.id}
                hoverable
                onClick={() =>
                  navigate(`/gestiones/ctacte/clientes/${s.entidad.id}`)
                }
                styles={{ body: { padding: "12px 16px" } }}
                style={{ borderRadius: "12px", border: "1px solid #f0f0f0" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      strong
                      style={{
                        fontSize: "15px",
                        color: "#262626",
                        display: "block",
                      }}
                    >
                      {s.entidad.nombre}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "2px",
                        flexWrap: "wrap",
                      }}
                    >
                      {!(s.entidad.ctaCteConfig as CtaCteConfig | undefined)?.habilitado && (
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#ff4d4f",
                            fontWeight: 600,
                          }}
                        >
                          Configurar cuenta
                        </Text>
                      )}
                      {s.sobreLimite && (
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#faad14",
                            fontWeight: 600,
                          }}
                        >
                          <MdWarning size={12} style={{ verticalAlign: "middle", marginRight: 2 }} />
                          Superó límite
                        </Text>
                      )}
                      {s.plazoVencido && (
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#ff4d4f",
                            fontWeight: 600,
                          }}
                        >
                          <MdWarning size={12} style={{ verticalAlign: "middle", marginRight: 2 }} />
                          Plazo vencido
                        </Text>
                      )}
                    </div>
                  </div>
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      color: saldoDisplay >= 0 ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {saldoDisplay >= 0 ? "+" : "-"}$
                    {Math.abs(s.saldo).toLocaleString("es-AR")}
                  </Text>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AdminCtaCtePage;
