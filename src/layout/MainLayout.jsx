import { Layout, theme } from "antd";
import { useState, useMemo } from "react"; // Se añade useMemo para posible optimización
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader"; // Importamos el nuevo componente

const { Content } = Layout;

const MainLayout = () => {
  // Estado para determinar si estamos en un tamaño de pantalla "móvil"
  const [isMobile, setIsMobile] = useState(false);
  // Estado para determinar si el sidebar está colapsado
  const [collapsed, setCollapsed] = useState(false);

  // Obtener tokens de tema
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Función para alternar el estado de colapsado
  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  // Función para manejar el breakpoint del Sider de Ant Design
  const handleBreakpoint = (broken) => {
    setIsMobile(broken);
    // En móvil (broken es true), colapsamos el menú para que ocupe 0px
    setCollapsed(broken);
  };

  /* Se puede usar useMemo para optimizar el valor de 'collapsed' 
    que se pasa a los hijos, aunque en este caso la ganancia es mínima.
    Si se usara un estado derivado más complejo, sería más útil.
  */
  const currentCollapsed = useMemo(() => collapsed, [collapsed]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* El layout principal de Ant Design sugiere que el Sider se coloque 
        junto al Content, dentro de otro Layout (como se hace aquí), o 
        directamente como hermanos si no hay Header.
        Mantener Sidebar fuera del Layout que contiene Header y Content es una convención común. 
      */}
      <Sidebar
        setCollapsed={setCollapsed}
        handleBreakpoint={handleBreakpoint}
        isMobile={isMobile}
        collapsed={currentCollapsed} // Usamos 'collapsed' directamente o 'currentCollapsed'
      />
      <Layout>
        {/* Usamos el componente Header desacoplado */}
        <AppHeader collapsed={currentCollapsed} handleToggle={handleToggle} />

        <Content
          style={{ padding: 10, paddingLeft: 25, background: colorBgContainer }}
        >
          {/* El contenido de las rutas anidadas */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
