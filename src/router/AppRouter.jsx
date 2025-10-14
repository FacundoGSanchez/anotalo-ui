// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext"; // ⬅️ Importar el hook

// Importar todas las páginas
import Home from "../pages/Home";
import ClientList from "../pages/client/List";
import ClientDetail from "../pages/client/Detail";
import POSLayout from "../pages/POS/POSLayout";
import Login from "../pages/auth/Login";

const AppRouter = () => {
  // ⬅️ OBTENER EL ESTADO DEL CONTEXTO
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 1. Ruta de Autenticación (Público) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* 2. Rutas Privadas (Requieren Layout y Autenticación) */}
      <Route
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/" element={<Home />} />

        {/* Rutas de Clientes */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/client" element={<ClientDetail />} />
        <Route path="/client/:id" element={<ClientDetail />} />

        {/* Rutas de POS */}
        <Route path="/puntoventa" element={<POSLayout />} />
      </Route>

      {/* 3. Ruta Catch-All (404 o Redirección a Home/Login) */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRouter;
