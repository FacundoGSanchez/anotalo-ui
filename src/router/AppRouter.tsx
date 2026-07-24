import { useEffect, type ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { MovimientoSessionProvider } from "@/context/MovimientoSessionContext";
import Home from "@/pages/Home";
import Login from "@/pages/auth/LoginPage";
import POSAnotalo from "@/pages/POSAnotalo/POSAnotalo";
import MovimientosPage from "@/pages/Reportes/Movimientos/MovimientosPage";
import EntidadesPage from "@/pages/Entidades/EntidadesPage";
import MoreMenuPage from "@/pages/MoreMenu/MoreMenuPage";
import AdminCtaCtePage from "@/pages/Gestiones/AdminCtaCte/AdminCtaCtePage";
import DetalleCtaCtePage from "@/pages/Gestiones/AdminCtaCte/DetalleCtaCtePage";
import AdminCajaPage from "@/pages/Gestiones/AdminCaja/AdminCajaPage";
import AdminComprasPage from "@/pages/Gestiones/AdminCompras/AdminComprasPage";
import SaldoCtasCtesPage from "@/pages/Reportes/SaldoCtasCtes/SaldoCtasCtesPage";
import ResumenVentasPage from "@/pages/Reportes/ResumenVentas/ResumenVentasPage";
import ConfigPosPage from "@/pages/Configuraciones/ConfigPosPage";
import RubrosConfigPage from "@/pages/Configuraciones/RubrosConfigPage";
import FormasPagoConfigPage from "@/pages/Configuraciones/FormasPagoConfigPage";
import SucursalesConfigPage from "@/pages/Configuraciones/SucursalesConfigPage";
import UsuariosConfigPage from "@/pages/Configuraciones/UsuariosConfigPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

interface PermissionRouteProps {
  modulo: string;
  formulario: string;
  accion?: string;
  children: ReactNode;
}

const PermissionRoute = ({ modulo, formulario, accion, children }: PermissionRouteProps) => {
  const { can } = useAuth();
  if (!can(modulo, formulario, accion)) return <Navigate to="/" replace />;
  return children;
};

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

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
