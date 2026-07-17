import { Navigate, Route, Routes } from "react-router-dom";
import FactureDetail from "../pages/facturation/FactureDetail";
import FactureForm from "../pages/facturation/FactureForm";
import FactureHistorique from "../pages/facturation/FactureHistorique";
import FactureList from "../pages/facturation/FactureList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/commercial/factures" replace />} />
      <Route path="/factures" element={<FactureList />} />
      <Route path="/factures/nouvelle" element={<FactureForm />} />
      <Route path="/factures/:id" element={<FactureDetail />} />
      <Route path="/commercial/factures" element={<FactureList />} />
      <Route path="/commercial/factures/nouvelle" element={<FactureForm />} />
      <Route path="/commercial/factures/:id" element={<FactureDetail />} />
      <Route path="/client/factures" element={<FactureHistorique />} />
      <Route path="/client/factures/:id" element={<FactureDetail />} />
    </Routes>
  );
}
