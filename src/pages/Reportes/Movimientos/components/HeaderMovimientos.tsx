import { Typography, Button } from "antd";
import { MdFilterList } from "react-icons/md";

const { Title } = Typography;

interface HeaderMovimientosProps {
  onOpenFiltros: () => void;
}

const HeaderMovimientos = ({ onOpenFiltros }: HeaderMovimientosProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Movimientos
        </Title>
      </div>

      <Button
        type="default"
        icon={<MdFilterList size={22} />}
        onClick={onOpenFiltros}
        style={{
          border: "1px solid #1890ff",
          color: "#1890ff",
          display: "flex",
          alignItems: "center",
        }}
      />
    </div>
  );
};

export default HeaderMovimientos;
