import React from "react";
import { Form, Input, Button, Space, Switch, Typography } from "antd";
import { MdSave, MdPhone } from "react-icons/md";

const { Text } = Typography;

const EntidadForm = ({ form, isEdit, colorTema, isCliente, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item name="nombre" label="Denominación / Nombre"
        rules={[{ required: true, message: "La denominación es obligatoria" }]}>
        <Input placeholder="Ej: Juan Pérez o Empresa S.A." size="large" style={{ padding: "12px", borderRadius: "8px" }} />
      </Form.Item>

      <Form.Item name="telefono" label="Teléfono de Contacto">
        <Input type="number" inputMode="numeric" prefix={<MdPhone color={colorTema} style={{ marginRight: "8px" }} />}
          placeholder="Ej: 3511234567" size="large" style={{ padding: "12px", borderRadius: "8px" }} />
      </Form.Item>

      {isCliente && (
        <div style={{ marginTop: "24px", marginBottom: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <Text strong style={{ fontSize: "14px" }}>Cuenta Corriente</Text>
            <Form.Item name={["ctaCteConfig", "habilitado"]} valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev?.ctaCteConfig?.habilitado !== cur?.ctaCteConfig?.habilitado}>
            {({ getFieldValue }) => {
              const habilitado = getFieldValue(["ctaCteConfig", "habilitado"]);
              return habilitado ? (
                <>
                  <Form.Item name={["ctaCteConfig", "importeMaximo"]} label="Tope Cuenta Corriente"
                    rules={[{ required: true, message: "Indicá el tope máximo" }]}>
                    <Input type="number" inputMode="numeric" placeholder="Ej: 50000"
                      size="large" style={{ padding: "12px", borderRadius: "8px" }} />
                  </Form.Item>

                  <Form.Item name={["ctaCteConfig", "plazoDias"]} label="Plazo (días)"
                    rules={[{ required: true, message: "Indicá el plazo en días" }]}>
                    <Input type="number" inputMode="numeric" placeholder="Ej: 30"
                      size="large" style={{ padding: "12px", borderRadius: "8px" }} suffix="días" />
                  </Form.Item>

                  <Text type="secondary" style={{ fontSize: "11px", display: "block", marginTop: "-16px" }}>
                    Sobre primera compra
                  </Text>
                </>
              ) : null;
            }}
          </Form.Item>
        </div>
      )}

      <Space direction="vertical" style={{ width: "100%", marginTop: "24px" }} size={16}>
        <Button type="primary" block size="large" htmlType="submit" icon={<MdSave size={22} />}
          style={{ height: "54px", borderRadius: "12px", backgroundColor: colorTema, borderColor: colorTema, fontWeight: "600", fontSize: "16px" }}>
          Guardar {isCliente ? "Cliente" : "Proveedor"}
        </Button>
      </Space>
    </Form>
  );
};

export default EntidadForm;
