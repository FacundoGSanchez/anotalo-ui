import { Typography } from "antd";
import { MdAccountBalance } from "react-icons/md";

const { Title, Text } = Typography;

const SaldoCtasCtesPage = () => {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", color: "#eb2f96", marginBottom: "16px" }}>
        <MdAccountBalance />
      </div>
      <Title level={4} style={{ color: "#262626" }}>Saldo Ctas Ctes</Title>
      <Text type="secondary">Reporte de cuentas corrientes con alertas y condiciones — próximamente</Text>
    </div>
  );
};

export default SaldoCtasCtesPage;
