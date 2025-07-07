import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import ClientList from "../pages/ClientList";
import ClientAdd from "../pages/ClientAdd";
import POS from "../pages/POS";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientAdd />} />
        <Route path="/pos" element={<POS />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
