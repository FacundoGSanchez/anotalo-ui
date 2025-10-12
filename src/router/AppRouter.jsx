import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import ClientList from "../pages/client/List";
import ClientDetail from "../pages/client/Detail";
import POSLayout from "../pages/POS/POSLayout";
// import ProviderList from "../pages/provider/List";
// import ProviderDetail from "../pages/provider/Detail";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* ==== Clientes ===== */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/client" element={<ClientDetail />} />
        <Route path="/client/:id" element={<ClientDetail />} />

        {/* ==== Proveedores ===== */}
        {/* <Route path="/providers" element={<ProviderList />} />
        <Route path="/provider" element={<ProviderDetail />} />
        <Route path="/provider/:id" element={<ProviderDetail />} /> */}
      </Route>
      {/* Punto de Venta  sin Layout*/}
      <Route path="/pos" element={<POSLayout />} />
    </Routes>
  );
};

export default AppRouter;
