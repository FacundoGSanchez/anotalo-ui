import { Typography } from "antd";
import { MdBarChart } from "react-icons/md";

const { Title, Text } = Typography;

const ResumenVentasPage = () => {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", color: "#52c41a", marginBottom: "16px" }}>
        <MdBarChart />
      </div>
      <Title level={4} style={{ color: "#262626" }}>Resumen Ventas</Title>
      <Text type="secondary">Desglose de ventas por periodo y rubro — próximamente</Text>
    </div>
  );
};

export default ResumenVentasPage;
