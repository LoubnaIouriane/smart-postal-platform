import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Agences from "./pages/admin/Agences";
import Commerciaux from "./pages/admin/Commerciaux";
import Facteurs from "./pages/admin/Facteurs";

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

                    {/* ---- Espace ADMIN ---- */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin/agences" element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}><Agences /></ProtectedRoute>
                    } />
                    <Route path="/admin/commerciaux" element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}><Commerciaux /></ProtectedRoute>
                    } />
                    <Route path="/admin/facteurs" element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}><Facteurs /></ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={["ADMIN", "CLIENT", "COMMERCIAL", "FACTEUR"]}><Profile /></ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
