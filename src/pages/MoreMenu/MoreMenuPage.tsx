import { useEffect } from "react";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdGridView } from "react-icons/md";
import MenuList from "@/components/MenuList";

const { Text } = Typography;

const MoreMenuPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <Button
          type="text"
          icon={<MdArrowBack size={24} />}
          onClick={() => navigate(-1)}
        />
        <MdGridView size={24} color="#3f4a6d" />
        <Text strong style={{ fontSize: "18px", color: "#262626" }}>
          Menú
        </Text>
      </div>
      <div>
        <MenuList darkTheme={false} />
      </div>
    </div>
  );
};

export default MoreMenuPage;
