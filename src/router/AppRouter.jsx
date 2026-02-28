import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/LoginPage.jsx";
import POSAnotalo from "../pages/POSAnotalo/POSAnotalo.jsx";
import MovimientosPage from "../pages/Movimientos/MovimientosPage.jsx";

// IMPORTANTE: Importamos solo el Orquestador
import EntidadesPage from "../pages/Entidades/EntidadesPage.jsx";

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="pos/anotalo" element={<POSAnotalo />} />
        <Route path="movimientos" element={<MovimientosPage />} />

        {/* MODULO ENTIDADES: Todas las rutas apuntan al Orquestador */}
        {/* El componente EntidadesPage usará los parámetros :action e :id para decidir qué mostrar */}
        <Route path="entidades/:tipo" element={<EntidadesPage />} />
        <Route path="entidades/:tipo/:action" element={<EntidadesPage />} />
        <Route path="entidades/:tipo/:action/:id" element={<EntidadesPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
