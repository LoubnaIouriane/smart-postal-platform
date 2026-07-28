import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";
import ExpeditionPage from "./pages/expedition/ExpeditionPage";
import TrackingPage from "./pages/expedition/TrackingPage";
import CommercialList from "./pages/commercial/CommercialList";
import FacteurCollectePage from "./pages/facteur/FacteurCollectePage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/pre-inscription" element={<PreInscription />} />

                    <Route path="/client/dashboard" element={
                        <ProtectedRoute allowedRoles={["CLIENT"]}><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/commercial/dashboard" element={
                        <ProtectedRoute allowedRoles={["COMMERCIAL"]}><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/facteur/dashboard" element={
                        <ProtectedRoute allowedRoles={["FACTEUR"]}><Dashboard /></ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={["CLIENT", "COMMERCIAL", "FACTEUR"]}><Profile /></ProtectedRoute>
                    } />

                    {/* Route temporaire pour tester sans authentification */}
                    <Route path="/test-expedition" element={<ExpeditionPage />} />
                    <Route path="/tracking" element={<TrackingPage />} />
                    <Route path="/facteur/collecte" element={<FacteurCollectePage />} />

                    {/* Route finale, protégée, pour utilisation réelle */}
                    <Route path="/client/expeditions" element={
                        <ProtectedRoute allowedRoles={["CLIENT"]}><ExpeditionPage /></ProtectedRoute>
                    } />

                    <Route path="/commercial/liste" element={<CommercialList />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;