import { Layout, theme, Typography } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import AppHeader from "./Header/AppHeader";
import BottomNav from "./BottomNav/BottomNav";
import CardUser from "./CardUser/CardUser";
import { useDevice } from "../context/DeviceContext";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import "./index.css";

const { Text } = Typography;
const { Content } = Layout;

const MainLayout = () => {
  const { isMobile } = useDevice();
  const { session } = useAuth();
  const currentOrgId = authService.getCurrentOrgId();
  const currentOrg = session?.organizaciones?.find((o) => o.id === currentOrgId);
  const orgName = currentOrg?.nombre || session?.organizaciones?.[0]?.nombre || "ANOTALO";

  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  return (
    <Layout className="main-layout" style={{ minHeight: "100vh" }}>
      {!isMobile && <Sidebar />}

      <Layout className="main-layout__content">
        {!isMobile && <AppHeader />}

        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              borderBottom: `1px solid ${colorBorderSecondary}`,
              background: colorBgContainer,
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Logo.png`}
              alt="ANOTALO"
              style={{ height: 28, width: "auto" }}
            />
            <Text strong style={{ fontSize: "15px", color: "#001529" }}>
              {orgName}
            </Text>
            <CardUser />
          </div>
        )}

        <Content
          className="main-layout__page"
          style={{ background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>

      {isMobile && <BottomNav />}
    </Layout>
  );
};

export default MainLayout;
