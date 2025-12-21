import { Routes, Route, Navigate } from "react-router-dom";

// 🧩 Layouts
import MainLayout from "../layout/MainLayout";

// 🧠 Contexto de autenticación
import { useAuth } from "../context/AuthContext";

// 📄 Páginas
import Home from "../pages/Home";
import ClientList from "../pages/client/List";
import ClientDetail from "../pages/client/Detail";
import SupplierList from "../pages/suppliers/List";
import SupplierDetail from "../pages/suppliers/Detail";
import ItemList from "../pages/items/List.jsx";
import ItemDetail from "../pages/items/Detail.jsx";
import Login from "../pages/auth/Login";
import POS from "../pages/POS/_index.jsx";
import POSAnotalo from "../pages/POSAnotalo/_index.jsx";

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  // 🔒 Componente de protección de rutas
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  // Mientras se carga el estado de autenticación
  if (loading) return <div>Cargando...</div>;

  return (
    <Routes>
      {/* Ruta de login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Rutas principales con layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="client" element={<ClientDetail />} />
        <Route path="client/:id" element={<ClientDetail />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="supplier" element={<SupplierDetail />} />
        <Route path="supplier/:id" element={<SupplierDetail />} />
        <Route path="items" element={<ItemList />} />
        <Route path="item" element={<ItemDetail />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="pos" element={<POS />} />
        <Route path="pos/anotalo" element={<POSAnotalo />} />
      </Route>

      {/* Redirección por defecto */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
