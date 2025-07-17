import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import ClientList from "../pages/Clients/ClientList";
import ClientDetail from "../pages/Clients/ClientDetail";
import POSLayout from "../pages/POS/POSLayout";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clientsDetail" element={<ClientDetail />} />
        <Route path="/clientsDetail/:id" element={<ClientDetail />} />
      </Route>
      {/* Punto de Venta  sin Layout*/}
      <Route path="/pos" element={<POSLayout />} />  
    </Routes>
  );
};

export default AppRouter;
