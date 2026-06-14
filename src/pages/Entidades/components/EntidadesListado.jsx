import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Input, Divider, Tag } from "antd";
import { MdArrowBack, MdAdd, MdSearch, MdChevronRight, MdWarning } from "react-icons/md";
import dayjs from "dayjs";
import { entidadService } from "../../../services/entidadService";
import { movimientoService } from "../../../services/movimientoService";
import EntidadDetalleModal from "./EntidadDetalle/EntidadDetalleContainer";

const { Text } = Typography;

const calcularSaldoEntidad = (entidadId) => {
  const movs = movimientoService.getAll().filter(
    (m) =>
      m.entidad?.id === entidadId &&
      (m.formaPago === "Cta Corriente" || m.tipo === "Cobro"),
  );
  let saldo = 0;
  movs.forEach((m) => {
    const importe = Number(m.importe) || 0;
    if (m.tipo === "Venta") {
      saldo += importe;
    } else if (m.tipo === "Cobro" || m.tipo === "Pago") {
      saldo -= importe;
    }
  });
  return saldo;
};

const verificarPlazoVencido = (entidadId, plazoDias) => {
  if (!plazoDias) return false;
  const movs = movimientoService.getAll().filter(
    (m) =>
      m.entidad?.id === entidadId &&
      (m.formaPago === "Cta Corriente" || m.tipo === "Cobro"),
  );
  if (movs.length === 0) return false;
  const fechas = movs.map((m) => dayjs(m.fecha));
  const masAntigua = fechas.reduce((a, b) => (a.isBefore(b) ? a : b));
  const diasTranscurridos = dayjs().diff(masAntigua, "day");
  return diasTranscurridos > plazoDias;
};

const EntidadesListado = ({ tipo: tipoProp, onBack, simple }) => {
  const { tipo: tipoParam } = useParams();
  const tipo = tipoProp || tipoParam;
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [lista, setLista] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const isCliente = tipo === "clientes";
  const colorTema = isCliente ? "#1890ff" : "#fa8c16";
  const avatarBg = isCliente ? "#1890ff12" : "#fa8c1612";

  const cargar = useCallback(() => {
    const activos = entidadService.getActivos(tipo);
    setLista(activos.sort((a, b) => b.id - a.id));
  }, [tipo]);

  useEffect(() => {
    cargar();
    window.addEventListener("local-db-update", cargar);
    return () => window.removeEventListener("local-db-update", cargar);
  }, [cargar]);

  const datosFiltrados = lista.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.nro?.toString().includes(busqueda),
  );

  const openNew = () => {
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditId(record.id);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: simple ? "0" : "16px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!simple && (
            <>
              <Button
                icon={<MdArrowBack size={20} />}
                type="text"
                onClick={() => (onBack ? onBack() : navigate("/"))}
              />
              <Text strong style={{ fontSize: "18px", margin: 0 }}>
                {tipo === "clientes" ? "Clientes" : "Proveedores"}
              </Text>
            </>
          )}
          {simple && (
            <Text strong style={{ fontSize: "18px", margin: 0, textTransform: "capitalize" }}>
              {tipo}
            </Text>
          )}
        </div>
        <Button
          type="primary"
          icon={<MdAdd size={18} />}
          onClick={openNew}
          style={{ borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
        />
      </div>

      <Input
        prefix={<MdSearch size={20} color="#bfbfbf" />}
        placeholder={`Buscar en ${tipo}...`}
        allowClear
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "10px", borderRadius: "10px", padding: "8px 10px" }}
      />

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        {datosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Text type="secondary">No hay {tipo} activos</Text>
          </div>
        ) : (
          datosFiltrados.map((record, idx) => {
            const ctaConfig = record.ctaCteConfig || {};
            const habilitado = ctaConfig.habilitado;
            let saldo = null;
            let sobreLimite = false;
            let plazoVencido = false;

            if (habilitado) {
              saldo = calcularSaldoEntidad(record.id);
              if (ctaConfig.importeMaximo) {
                sobreLimite = Math.abs(saldo) > ctaConfig.importeMaximo;
              }
              plazoVencido = verificarPlazoVencido(record.id, ctaConfig.plazoDias);
            }

            return (
              <div key={record.id}>
                <div
                  style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => openEdit(record)}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: avatarBg, color: colorTema,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "14px", flexShrink: 0, marginRight: "12px",
                  }}>
                    {record.nombre?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Text strong style={{ fontSize: "14px", display: "block" }}>
                        {record.nombre}
                      </Text>
                      {habilitado && (
                        <Tag
                          color="#eb2f96"
                          style={{
                            borderRadius: "4px",
                            fontSize: "9px",
                            lineHeight: "16px",
                            padding: "0 5px",
                            margin: 0,
                            fontWeight: 700,
                          }}
                        >
                          CTA CTE
                        </Tag>
                      )}
                      {(sobreLimite || plazoVencido) && (
                        <MdWarning size={14} color="#faad14" />
                      )}
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Código #{record.nro}
                      {record.telefono && ` • Tel: ${record.telefono}`}
                    </Text>
                    {habilitado && (sobreLimite || plazoVencido) && (
                      <div style={{ marginTop: "2px" }}>
                        {sobreLimite && (
                          <Text style={{ fontSize: "11px", color: "#faad14", fontWeight: 600, marginRight: "8px" }}>
                            Superó límite
                          </Text>
                        )}
                        {plazoVencido && (
                          <Text style={{ fontSize: "11px", color: "#ff4d4f", fontWeight: 600 }}>
                            Plazo vencido
                          </Text>
                        )}
                      </div>
                    )}
                  </div>
                  <Button type="text" icon={<MdChevronRight size={20} />} style={{ color: "#8c8c8c", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} />
                </div>
                {idx < datosFiltrados.length - 1 && <Divider style={{ margin: "0", borderColor: "#f0f0f0" }} />}
              </div>
            );
          })
        )}
      </div>

      <EntidadDetalleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tipo={tipo}
        editId={editId}
        onSaved={cargar}
      />
    </div>
  );
};

export default EntidadesListado;
