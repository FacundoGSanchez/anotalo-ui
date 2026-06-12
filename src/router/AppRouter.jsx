import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/LoginPage.jsx";
import POSAnotalo from "../pages/POSAnotalo/POSAnotalo.jsx";
import MovimientosPage from "../pages/Reportes/Movimientos/MovimientosPage.jsx";

// IMPORTANTE: Importamos solo el Orquestador
import EntidadesPage from "../pages/Entidades/EntidadesPage.jsx";
import MoreMenuPage from "../pages/MoreMenu/MoreMenuPage.jsx";
import AdminCtaCtePage from "../pages/Gestiones/AdminCtaCte/AdminCtaCtePage.jsx";
import DetalleCtaCtePage from "../pages/Gestiones/AdminCtaCte/DetalleCtaCtePage.jsx";
import AdminCajaPage from "../pages/Gestiones/AdminCaja/AdminCajaPage.jsx";
import AdminComprasPage from "../pages/Gestiones/AdminCompras/AdminComprasPage.jsx";
import SaldoCtasCtesPage from "../pages/Reportes/SaldoCtasCtes/SaldoCtasCtesPage.jsx";
import PedidosPage from "../pages/Pedidos/PedidosPage.jsx";
import ResumenVentasPage from "../pages/Reportes/ResumenVentas/ResumenVentasPage.jsx";

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

        {/* GESTIONES */}
        <Route path="gestiones/ctacte" element={<AdminCtaCtePage />} />
        <Route path="gestiones/ctacte/:tipo/:id" element={<DetalleCtaCtePage />} />
        <Route path="gestiones/caja" element={<AdminCajaPage />} />

        {/* REPORTES (redirects a Gestiones) */}
        <Route path="reportes/ctacte" element={<AdminCtaCtePage />} />
        <Route path="reportes/ctacte/:tipo/:id" element={<DetalleCtaCtePage />} />
        <Route path="reportes/caja" element={<AdminCajaPage />} />

        {/* COMPRAS */}
        <Route path="compras" element={<AdminComprasPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="reportes/saldo-ctas-ctes" element={<SaldoCtasCtesPage />} />
        <Route path="reportes/resumen-ventas" element={<ResumenVentasPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
