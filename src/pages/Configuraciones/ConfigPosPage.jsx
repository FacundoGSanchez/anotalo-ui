import { useState, useEffect } from "react";
import { Typography, Button, Switch, Card, message } from "antd";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { orgService } from "../../services/orgService";
import { useCurrentOrg } from "../../hooks/useCurrentOrg";

const { Text } = Typography;

const ConfigPosPage = () => {
  const navigate = useNavigate();
  const orgId = useCurrentOrg();
  const [configPOS, setConfigPOS] = useState({ usaRubro: false });

  useEffect(() => {
    setConfigPOS(orgService.getConfigPOS(orgId));
  }, [orgId]);

  const toggleRubro = (checked) => {
    const nueva = { ...configPOS, usaRubro: checked };
    setConfigPOS(nueva);
    orgService.saveConfigPOS(orgId, nueva);
    message.success(checked ? "Rubros activados" : "Rubros desactivados");
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <Button type="text" icon={<MdArrowBack size={24} />} onClick={() => navigate(-1)} />
        <Text strong style={{ fontSize: "18px" }}>Configuración POS</Text>
      </div>

      <Card style={{ borderRadius: "16px", border: "1px solid #f0f0f0" }} styles={{ body: { padding: "20px" } }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: "15px", display: "block" }}>Usar rubros en POS</Text>
            <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
              Activa la selección de rubro al agregar items en el POS. Si se desactiva, se muestra un botón único "AGREGAR".
            </Text>
          </div>
          <Switch checked={configPOS.usaRubro} onChange={toggleRubro} />
        </div>
      </Card>
    </div>
  );
};

export default ConfigPosPage;
