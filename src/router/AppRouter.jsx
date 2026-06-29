import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import { MovimientoSessionProvider } from "../context/MovimientoSessionContext";
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
import ResumenVentasPage from "../pages/Reportes/ResumenVentas/ResumenVentasPage.jsx";
import ConfigPosPage from "../pages/Configuraciones/ConfigPosPage.jsx";
import RubrosConfigPage from "../pages/Configuraciones/RubrosConfigPage.jsx";
import FormasPagoConfigPage from "../pages/Configuraciones/FormasPagoConfigPage.jsx";
import SucursalesConfigPage from "../pages/Configuraciones/SucursalesConfigPage.jsx";
import UsuariosConfigPage from "../pages/Configuraciones/UsuariosConfigPage.jsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppRouter = () => {
  const { isAuthenticated, loading, can } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  const PermissionRoute = ({ modulo, formulario, accion, children }) => {
    if (!can(modulo, formulario, accion)) return <Navigate to="/" replace />;
    return children;
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <MovimientoSessionProvider>
      <ScrollToTop />
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
        <Route path="reportes/saldo-ctas-ctes" element={<SaldoCtasCtesPage />} />
        <Route path="reportes/resumen-ventas" element={<ResumenVentasPage />} />

        {/* CONFIGURACIONES */}
        <Route path="configuraciones/pos" element={<PermissionRoute modulo="CONFIG" formulario="pos"><ConfigPosPage /></PermissionRoute>} />
        <Route path="configuraciones/rubros" element={<PermissionRoute modulo="CONFIG" formulario="rubros"><RubrosConfigPage /></PermissionRoute>} />
        <Route path="configuraciones/formas-pago" element={<PermissionRoute modulo="CONFIG" formulario="formas-pago"><FormasPagoConfigPage /></PermissionRoute>} />
        <Route path="configuraciones/sucursales" element={<PermissionRoute modulo="CONFIG" formulario="sucursales"><SucursalesConfigPage /></PermissionRoute>} />
        <Route path="configuraciones/usuarios" element={<PermissionRoute modulo="CONFIG" formulario="usuarios"><UsuariosConfigPage /></PermissionRoute>} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
    </MovimientoSessionProvider>
  );
};

export default AppRouter;

