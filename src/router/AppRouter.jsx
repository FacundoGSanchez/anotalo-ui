import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import ClientList from "../pages/ClientList";
import ClientDetail from "../pages/ClientDetail";
import POS from "../pages/POS";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clientsDetail" element={<ClientDetail />} />
        <Route path="/clientsDetail/:id" element={<ClientDetail />} />
        <Route path="/pos" element={<POS />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
