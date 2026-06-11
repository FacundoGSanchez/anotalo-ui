import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Typography, Input, Space, Card, Popconfirm, message, Tag } from "antd";
import { MdArrowBack, MdAdd, MdSearch, MdChevronRight, MdDeleteOutline, MdWarning } from "react-icons/md";
import dayjs from "dayjs";
import { entidadService } from "../../../services/entidadService";
import { movimientoService } from "../../../services/movimientoService";

const { Text } = Typography;

const calcularSaldoEntidad = (entidadId) => {
  const movs = movimientoService.getAll().filter(
    (m) => m.entidad?.id === entidadId && m.formaPago === "Cta Corriente",
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
    (m) => m.entidad?.id === entidadId && m.formaPago === "Cta Corriente",
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

  useEffect(() => {
    const cargar = () => {
      const activos = entidadService.getActivos(tipo);
      setLista(activos.sort((a, b) => b.id - a.id));
    };
    cargar();
    window.addEventListener("local-db-update", cargar);
    return () => window.removeEventListener("local-db-update", cargar);
  }, [tipo]);

  const datosFiltrados = lista.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.nro?.toString().includes(busqueda),
  );

  const handleDelete = (record) => {
    entidadService.softDelete(tipo, record.id);
    message.success("Entidad eliminada");
    const activos = entidadService.getActivos(tipo);
    setLista(activos.sort((a, b) => b.id - a.id));
  };

  const columns = [
    {
      render: (_, record) => {
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2px 0",
            }}
          >
            <Space direction="vertical" size={0}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Text strong style={{ fontSize: "15px" }}>
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
                Código #{record.nro}{" "}
                {record.telefono && `• Tel: ${record.telefono}`}
              </Text>
              {habilitado && (
                <Space size={8}>
                  {sobreLimite && (
                    <Text style={{ fontSize: "11px", color: "#faad14", fontWeight: 600 }}>
                      Superó límite
                    </Text>
                  )}
                  {plazoVencido && (
                    <Text style={{ fontSize: "11px", color: "#ff4d4f", fontWeight: 600 }}>
                      Plazo vencido
                    </Text>
                  )}
                </Space>
              )}
            </Space>
            <Space>
              <Popconfirm
                title="¿Eliminar esta entidad?"
                description="Ya no aparecerá en el listado de activos."
                onConfirm={() => handleDelete(record)}
                okText="Eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<MdDeleteOutline size={18} />}
                />
              </Popconfirm>
              <MdChevronRight size={22} color="#bfbfbf" />
            </Space>
          </div>
        );
      },
    },
  ];

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
        <Space>
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
        </Space>
        <Button
          type="primary"
          shape="circle"
          icon={<MdAdd size={24} />}
          onClick={() => navigate(`/entidades/${tipo}/nuevo`)}
          style={{ boxShadow: "0 4px 10px rgba(24, 144, 255, 0.3)" }}
        />
      </div>

      <Input
        prefix={<MdSearch size={20} color="#bfbfbf" />}
        placeholder={`Buscar en ${tipo}...`}
        allowClear
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "10px", borderRadius: "10px", padding: "8px 10px" }}
      />

      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          size="middle"
          dataSource={datosFiltrados}
          columns={columns}
          rowKey="id"
          showHeader={false}
          pagination={false}
          locale={{ emptyText: `No hay ${tipo} activos` }}
          onRow={(record) => ({
            onClick: (e) => {
              if (e.target.closest(".ant-popconfirm") || e.target.closest("button")) return;
              navigate(`/entidades/${tipo}/edit/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </div>
  );
};

export default EntidadesListado;
