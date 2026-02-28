import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Typography, Input, Space, Card } from "antd";
import { MdArrowBack, MdAdd, MdSearch, MdChevronRight } from "react-icons/md";

const { Title, Text } = Typography;

const EntidadesListado = () => {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`db_${tipo}`)) || [];
    // 🔍 Filtramos para traer solo los que tienen activo === true
    const activos = saved.filter((item) => item.activo === true);
    setLista(activos.sort((a, b) => b.id - a.id));
  }, [tipo]);

  // Filtro de búsqueda sobre la lista de activos
  const datosFiltrados = lista.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.nro?.toString().includes(busqueda),
  );

  const columns = [
    {
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 0",
          }}
        >
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: "15px" }}>
              {record.nombre}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Código #{record.nro}{" "}
              {record.telefono && `• Tel: ${record.telefono}`}
            </Text>
          </Space>
          <MdChevronRight size={22} color="#bfbfbf" />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      {/* HEADER LISTADO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Space>
          <Button
            icon={<MdArrowBack size={20} />}
            type="text"
            onClick={() => navigate("/")}
          />
          <Title level={3} style={{ margin: 0, textTransform: "capitalize" }}>
            {tipo}
          </Title>
        </Space>
        <Button
          type="primary"
          shape="circle"
          icon={<MdAdd size={24} />}
          onClick={() => navigate(`/entidades/${tipo}/nuevo`)}
          style={{ boxShadow: "0 4px 10px rgba(24, 144, 255, 0.3)" }}
        />
      </div>

      {/* BUSCADOR */}
      <Input
        prefix={<MdSearch size={20} color="#bfbfbf" />}
        placeholder={`Buscar en ${tipo}...`}
        allowClear
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "16px", borderRadius: "10px", padding: "10px" }}
      />

      {/* TABLA DE RESULTADOS */}
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
          dataSource={datosFiltrados}
          columns={columns}
          rowKey="id"
          showHeader={false}
          pagination={false}
          locale={{ emptyText: `No hay ${tipo} activos` }}
          onRow={(record) => ({
            onClick: () => navigate(`/entidades/${tipo}/edit/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </div>
  );
};

export default EntidadesListado;
