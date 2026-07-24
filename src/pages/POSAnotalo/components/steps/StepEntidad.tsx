import { useState, useEffect, useRef, useMemo } from "react";
import { Typography, Button, Alert, Divider } from "antd";
import { MdSearch, MdPerson, MdWarning } from "react-icons/md";
import { MOVIMIENTO_TIPOS } from "../../../../constants/posConstants";
import { orgService } from "../../../../services/orgService";
import { useCurrentOrg } from "../../../../hooks/useCurrentOrg";
import SelectorEntidadModal from "./components/SelectorEntidadModal";
import type { Entity, FormaPagoItem, MovimientoTipo, FormaPagoNormalized } from "@/types";

const { Text } = Typography;

interface StepEntidadProps {
  tipo: MovimientoTipo;
  formaPago?: string | null;
  formaPagos?: FormaPagoNormalized[];
  onNext: (entidad: Entity) => void;
  onBack?: () => void;
}

const StepEntidad = ({ tipo, formaPago, formaPagos, onNext, onBack }: StepEntidadProps) => {
  const orgId = useCurrentOrg();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cfRef = useRef<HTMLButtonElement>(null);
  const buscarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const target = cfRef.current || buscarRef.current;
    target?.focus();
  }, []);

  const esCliente = tipo === MOVIMIENTO_TIPOS.VENTA || tipo === MOVIMIENTO_TIPOS.COBRO;
  const formasPago: FormaPagoItem[] = orgService.getFormasPago(orgId, tipo);

  const requiereEntidad = useMemo(() => {
    if (formaPagos && formaPagos.length > 0) {
      return formaPagos.some((fp) => {
        const obj = formasPago.find((f) => f.key === (fp.nombre || fp.key));
        return obj?.requiereEntidad || false;
      });
    }
    const formaPagoObj = formasPago.find((f) => f.key === formaPago);
    return formaPagoObj?.requiereEntidad || false;
  }, [formaPagos, formaPago, formasPago]);

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
        {esCliente && !requiereEntidad && (
          <Button
            ref={cfRef}
            block
            size="large"
            type="dashed"
            icon={<MdPerson size={24} />}
            onClick={() => onNext({ id: 0, nombre: "Consumidor Final", activo: true })}
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

        <Button
          ref={buscarRef}
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

      {onBack && (
        <button
          tabIndex={0}
          onClick={onBack}
          onFocus={(e) => { e.currentTarget.style.borderColor = activeColor; e.currentTarget.style.color = activeColor; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.color = "#8c8c8c"; }}
          style={{
            marginTop: "16px",
            height: "50px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 600,
            border: "2px solid #d9d9d9",
            background: "#fff",
            color: "#8c8c8c",
            cursor: "pointer",
            transition: "all 0.15s",
            width: "100%",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          ← VOLVER
        </button>
      )}

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
