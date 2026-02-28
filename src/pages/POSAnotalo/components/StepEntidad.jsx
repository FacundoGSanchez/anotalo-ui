import React, { useState, useEffect, useRef } from "react";
import { Input, List, Typography, Tag, Button, Alert } from "antd";
import {
  MdSearch,
  MdPerson,
  MdStorefront,
  MdChevronRight,
  MdWarning,
} from "react-icons/md";

const { Text } = Typography;

const StepEntidad = ({ tipo, formaPago, onNext }) => {
  const [busqueda, setBusqueda] = useState("");
  const inputRef = useRef(null);

  const esVenta = tipo === "Venta";
  const esCtaCte = formaPago === "Cta Corriente";
  const colorTema = esVenta ? "#1890ff" : "#fa8c16";

  const predeterminado = esVenta
    ? { id: 0, nombre: "Consumidor Final" }
    : { id: 10, nombre: "Proveedor General" };

  // Datos simulados
  const dataMock = esVenta
    ? [
        { id: 1, nombre: "Juan Pérez" },
        { id: 2, nombre: "Empresa S.A." },
      ]
    : [
        { id: 11, nombre: "Distribuidora Arcor" },
        { id: 12, nombre: "Papelera Sur" },
      ];

  const filtrados = dataMock.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* MODO CUENTA CORRIENTE: Advertencia si es obligatorio */}
      {esCtaCte && (
        <Alert
          message={`Selección Obligatoria para Cuenta Corriente`}
          type="warning"
          showIcon
          icon={<MdWarning />}
          style={{ marginBottom: "16px", borderRadius: "8px" }}
        />
      )}

      {/* 1. OPCIÓN PREDETERMINADA: Solo se muestra si NO es Cuenta Corriente */}
      {!esCtaCte && (
        <div style={{ marginBottom: "16px" }}>
          <Text
            type="secondary"
            style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}
          >
            PREDETERMINADO
          </Text>
          <div
            onClick={() => onNext(predeterminado)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px",
              background: `${colorTema}10`,
              borderRadius: "10px",
              border: `1.5px solid ${colorTema}`,
              cursor: "pointer",
            }}
          >
            <MdPerson
              size={24}
              style={{ marginRight: "12px", color: colorTema }}
            />
            <Text strong style={{ fontSize: "15px", color: colorTema }}>
              {predeterminado.nombre}
            </Text>
          </div>
          <div style={{ textAlign: "center", margin: "12px 0" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              — ó buscar uno específico —
            </Text>
          </div>
        </div>
      )}

      {/* 2. BUSCADOR */}
      <Input
        ref={inputRef}
        size="large"
        placeholder={
          esCtaCte
            ? `NOMBRE OBLIGATORIO...`
            : `Buscar ${esVenta ? "cliente" : "proveedor"}...`
        }
        prefix={<MdSearch size={22} style={{ color: "#bfbfbf" }} />}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          borderRadius: "8px",
          height: "50px",
          border:
            esCtaCte && busqueda.length === 0
              ? `1.5px solid ${colorTema}`
              : "1px solid #d9d9d9",
        }}
      />

      <div style={{ flex: 1, overflowY: "auto", marginTop: "12px" }}>
        {busqueda.length > 0 ? (
          <List
            dataSource={filtrados}
            renderItem={(item) => (
              <div
                onClick={() => onNext(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  background: "#fff",
                  borderRadius: "8px",
                  marginBottom: "6px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <Text style={{ flex: 1 }}>{item.nombre}</Text>
                <MdChevronRight size={20} style={{ color: "#bfbfbf" }} />
              </div>
            )}
          />
        ) : (
          esCtaCte && (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                padding: "0 20px",
              }}
            >
              <Text type="secondary">
                Debe identificar al {esVenta ? "cliente" : "proveedor"} para
                registrar la deuda en su cuenta corriente.
              </Text>
            </div>
          )
        )}

        {/* BOTÓN CREAR */}
        {busqueda.length > 2 && (
          <Button
            type="dashed"
            block
            onClick={() => onNext({ id: "new", nombre: busqueda })}
            style={{
              marginTop: "8px",
              height: "48px",
              borderRadius: "8px",
              color: colorTema,
              borderColor: colorTema,
            }}
          >
            + Crear y asignar a "{busqueda}"
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepEntidad;
