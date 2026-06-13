import React, { useState } from "react";
import { Typography, Button, Alert, Divider } from "antd";
import { MdSearch, MdPerson, MdWarning } from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useAuth } from "../../../../context/AuthContext";
import SelectorEntidadModal from "./components/SelectorEntidadModal";

const { Text } = Typography;

const StepEntidad = ({ tipo, formaPago, onNext }) => {
  const { session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const esCliente = tipo === MOVIMIENTO_TIPOS.VENTA || tipo === MOVIMIENTO_TIPOS.COBRO;
  const formasPago = orgService.getFormasPago(session?.organizaciones?.[0]?.id, tipo);
  const formaPagoObj = formasPago.find((f) => f.key === formaPago);
  const requiereEntidad = formaPagoObj?.requiereEntidad || false;

  const tablaDB = esCliente ? "db_clientes" : "db_proveedores";
  const activeColor = esCliente ? "#1890ff" : "#fa8c16";

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "10px",
        }}
      >
        {/* 1. PREDETERMINADOS PRIMERO: Consumidor Final */}
        {esCliente && !requiereEntidad && (
          <Button
            block
            size="large"
            type="dashed"
            icon={<MdPerson size={24} />}
            onClick={() => onNext({ id: 0, nombre: "Consumidor Final" })}
            style={{
              height: "64px",
              borderRadius: "16px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              borderColor: activeColor,
              color: activeColor,
            }}
          >
            Consumidor Final
          </Button>
        )}

        {esCliente && !requiereEntidad && <Divider style={{ margin: "4px 0" }} />}

        {/* 2. ACCIÓN DE BÚSQUEDA PRINCIPAL */}
        <Button
          block
          size="large"
          icon={<MdSearch size={24} />}
          onClick={() => setIsModalOpen(true)}
          style={{
            height: "64px",
            borderRadius: "16px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            color: "#595959",
            background: "#fff",
            border: "1px solid #d9d9d9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          {esCliente
            ? "Buscar cliente existente..."
            : "Buscar proveedor existente..."}
        </Button>
      </div>

      {/* COMPONENTE SEPARADO PARA BÚSQUEDA Y ALTA */}
      <SelectorEntidadModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSelect={(item) => {
          setIsModalOpen(false);
          onNext(item);
        }}
        tipo={tipo}
        tablaDB={tablaDB}
        activeColor={activeColor}
      />

      {/* ADVERTENCIA SI REQUIERE ENTIDAD */}
      {(!esCliente || requiereEntidad) && (
        <div style={{ marginTop: "20px" }}>
          <Alert
            message="Identificación requerida"
            description={
              requiereEntidad
                ? "La forma de pago seleccionada requiere un titular."
                : "Para gastos o egresos debe identificar al proveedor."
            }
            type="info"
            showIcon
            icon={<MdWarning />}
            style={{ borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
};

export default StepEntidad;
