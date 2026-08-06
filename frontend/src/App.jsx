import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";
import CommercialList from "./pages/commercial/CommercialList";
import FactureDetail from "./pages/facturation/FactureDetail";
import FactureHistorique from "./pages/facturation/FactureHistorique";
import FactureList from "./pages/facturation/FactureList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pre-inscription" element={<PreInscription />} />

          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commercial/dashboard"
            element={
              <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facteur/dashboard"
            element={
              <ProtectedRoute allowedRoles={["FACTEUR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["CLIENT", "COMMERCIAL", "FACTEUR"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/commercial/liste" element={<CommercialList />} />

          <Route path="/factures" element={<FactureList />} />
          <Route path="/factures/:id" element={<FactureDetail />} />
          <Route path="/commercial/factures" element={<FactureList />} />
          <Route path="/commercial/factures/:id" element={<FactureDetail />} />
          <Route path="/client/factures" element={<FactureHistorique />} />
          <Route path="/client/factures/:id" element={<FactureDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

