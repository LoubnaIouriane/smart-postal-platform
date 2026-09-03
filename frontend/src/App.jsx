import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// =========================
// AUTH
// =========================
import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// =========================
// ADMIN
// =========================
import AdminDashboard from "./pages/admin/AdminDashboard";
import Agences from "./pages/admin/Agences";
import Commerciaux from "./pages/admin/Commerciaux";
import Facteurs from "./pages/admin/Facteurs";

// =========================
// COMMERCIAL
// =========================
import CommercialDashboard from "./pages/commercial/CommercialDashboard";
import CommercialList from "./pages/commercial/CommercialList";
import CommercialForm from "./pages/commercial/CommercialForm";
import ClientList from "./pages/commercial/ClientList";
import ClientRemise from "./pages/commercial/ClientRemise";
import ContratList from "./pages/commercial/ContratList";
import ContratForm from "./pages/commercial/ContratForm";
import ContratDetails from "./pages/commercial/ContratDetails";
import GrilleRemiseList from "./pages/commercial/GrilleRemiseList";
import GrilleRemiseForm from "./pages/commercial/GrilleRemiseForm";
import PreInscriptionList from "./pages/commercial/PreInscriptionList";

// =========================
// EXPEDITION
// =========================
import ExpeditionPage from "./pages/expedition/ExpeditionPage";
import TrackingPage from "./pages/expedition/TrackingPage";

// =========================
// FACTEUR
// =========================
import FacteurCollectePage from "./pages/facteur/FacteurCollectePage";

// =========================
// FACTURATION
// =========================
import FactureList from "./pages/facturation/FactureList";
import FactureDetail from "./pages/facturation/FactureDetail";
import FactureForm from "./pages/facturation/FactureForm";
import FactureHistorique from "./pages/facturation/FactureHistorique";
import Factures from "./pages/facturation/Factures";
import NouvelleFacture from "./pages/facturation/NouvelleFacture";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>

                <Routes>

                    {/* =====================================
                        AUTHENTIFICATION (public)
                    ===================================== */}

                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/pre-inscription"
                        element={<PreInscription />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />


                    {/* =====================================
                        DASHBOARDS
                    ===================================== */}

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
                                <CommercialDashboard />
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
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        PROFIL
                        Tous les rôles connectés
                    ===================================== */}

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "CLIENT",
                                    "COMMERCIAL",
                                    "FACTEUR",
                                    "ADMIN"
                                ]}
                            >
                                <Profile />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        ADMIN
                    ===================================== */}

                    <Route
                        path="/admin/agences"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Agences />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/commerciaux"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Commerciaux />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/facteurs"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Facteurs />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        COMMERCIAL
                    ===================================== */}

                    {/* Liste des commerciaux */}
                    <Route
                        path="/commercial/liste"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialList />
                            </ProtectedRoute>
                        }
                    />

                    {/* NOUVEAU : route commerciale */}
                    <Route
                        path="/commercial/commerciaux"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Formulaire commercial */}
                    <Route
                        path="/commercial/form"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Clients */}
                    <Route
                        path="/commercial/clients"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ClientList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Remise client */}
                    <Route
                        path="/commercial/client-remise/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ClientRemise />
                            </ProtectedRoute>
                        }
                    />

                    {/* Liste des contrats */}
                    <Route
                        path="/commercial/contrats"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Nouveau contrat */}
                    <Route
                        path="/commercial/contrats/nouveau"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Modifier contrat */}
                    <Route
                        path="/commercial/contrats/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Détails contrat */}
                    <Route
                        path="/commercial/contrats/:id/details"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Ancienne route conservée pour compatibilité */}
                    <Route
                        path="/commercial/contrat/form"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Ancienne route conservée pour compatibilité */}
                    <Route
                        path="/commercial/contrat/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Grilles de remise */}
                    <Route
                        path="/commercial/grilles-remise"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <GrilleRemiseList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/grille-remise/form"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <GrilleRemiseForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Pré-inscriptions */}
                    <Route
                        path="/commercial/preinscriptions"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <PreInscriptionList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Factures côté commercial */}
                    <Route
                        path="/commercial/factures"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <FactureList />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        EXPEDITIONS
                    ===================================== */}

                    <Route
                        path="/client/expeditions"
                        element={
                            <ProtectedRoute allowedRoles={["CLIENT"]}>
                                <ExpeditionPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tracking"
                        element={<TrackingPage />}
                    />


                    {/* =====================================
                        FACTEUR
                    ===================================== */}

                    <Route
                        path="/facteur/collecte"
                        element={
                            <ProtectedRoute allowedRoles={["FACTEUR"]}>
                                <FacteurCollectePage />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        FACTURATION
                    ===================================== */}

                    {/* Factures du client */}
                    <Route
                        path="/client/factures"
                        element={
                            <ProtectedRoute allowedRoles={["CLIENT"]}>
                                <FactureHistorique />
                            </ProtectedRoute>
                        }
                    />

                    {/* Liste des factures */}
                    <Route
                        path="/facturation"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <Factures />
                            </ProtectedRoute>
                        }
                    />

                    {/* Nouvelle facture */}
                    <Route
                        path="/facturation/nouvelle"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <NouvelleFacture />
                            </ProtectedRoute>
                        }
                    />

                    {/* Formulaire facture */}
                    <Route
                        path="/facturation/form"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <FactureForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* Détail facture */}
                    <Route
                        path="/facturation/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["CLIENT", "COMMERCIAL"]}
                            >
                                <FactureDetail />
                            </ProtectedRoute>
                        }
                    />


                    {/* =====================================
                        PAGE INCONNUE
                    ===================================== */}

                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />

                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;