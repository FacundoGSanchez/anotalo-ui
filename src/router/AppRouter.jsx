import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/LoginPage.jsx";
import POSAnotalo from "../pages/POSAnotalo/POSAnotalo.jsx";
import MovimientosPage from "../pages/Movimientos/MovimientosPage.jsx";

// IMPORTANTE: Importamos solo el Orquestador
import EntidadesPage from "../pages/Entidades/EntidadesPage.jsx";
import MoreMenuPage from "../pages/MoreMenu/MoreMenuPage.jsx";
import FormasPagoConfigPage from "../pages/FormasPagoConfig/FormasPagoConfigPage.jsx";
import ReporteCtaCte from "../pages/Reportes/ReporteCtaCte.jsx";
import DetalleCtaCtePage from "../pages/Reportes/DetalleCtaCtePage.jsx";
import ReporteCaja from "../pages/Reportes/ReporteCaja.jsx";

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

        {/* MODULO ENTIDADES */}
        <Route path="entidades" element={<EntidadesPage />} />
        <Route path="entidades/:tipo" element={<EntidadesPage />} />
        <Route path="entidades/:tipo/:action" element={<EntidadesPage />} />
        <Route path="entidades/:tipo/:action/:id" element={<EntidadesPage />} />

        {/* MAS OPCIONES */}
        <Route path="more" element={<MoreMenuPage />} />
        <Route path="more/formas-pago" element={<FormasPagoConfigPage />} />

        {/* REPORTES */}
        <Route path="reportes/ctacte" element={<ReporteCtaCte />} />
        <Route path="reportes/ctacte/:tipo/:id" element={<DetalleCtaCtePage />} />
        <Route path="reportes/caja" element={<ReporteCaja />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
