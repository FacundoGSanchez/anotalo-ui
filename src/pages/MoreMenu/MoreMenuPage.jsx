import { useEffect } from "react";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { MODULES } from "../../data/spec_Menu";
import { useAuth } from "../../context/AuthContext";

const { Text } = Typography;

const MoreMenuPage = () => {
  const navigate = useNavigate();
  const { can } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const visibleModules = MODULES
    .map((mod) => ({
      ...mod,
      items: mod.items.filter((item) => !item.permiso || can(item.permiso.modulo, item.permiso.formulario)),
    }))
    .filter((mod) => mod.items.length > 0);

  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
        }}
      >
        <Button
          type="text"
          icon={<MdArrowBack size={24} />}
          onClick={() => navigate(-1)}
        />
        <Text strong style={{ fontSize: "18px" }}>
          Menú
        </Text>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        {visibleModules.map((mod) => (
          <div key={mod.title} style={{ marginBottom: "8px" }}>
            <Text
              type="secondary"
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
                display: "block",
                marginBottom: "4px",
                color: "#8c8c8c",
              }}
            >
              {mod.title}
            </Text>
            {mod.items.map((item) => (
              <Button
                key={item.key}
                type="text"
                block
                icon={item.icon}
                onClick={() => navigate(item.route)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "40px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  paddingLeft: "8px",
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreMenuPage;
