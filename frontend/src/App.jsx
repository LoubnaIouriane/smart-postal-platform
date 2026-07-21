import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ================= AUTH =================

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";


// ================= MODULE ZAINEB - LISTES =================

import CommercialList from "./pages/commercial/CommercialList";
import ClientList from "./pages/commercial/ClientList";
import ContratList from "./pages/commercial/ContratList";
import GrilleRemiseList from "./pages/commercial/GrilleRemiseList";
import ClientRemise from "./pages/commercial/ClientRemise";
import PreInscriptionList from "./pages/commercial/PreInscriptionList";
import ContratDetails from "./pages/commercial/ContratDetails";


// ================= MODULE ZAINEB - FORMULAIRES =================

import CommercialForm from "./pages/commercial/CommercialForm";
import ContratForm from "./pages/commercial/ContratForm";


// ================= DASHBOARD COMMERCIAL =================

import CommercialDashboard from "./pages/commercial/CommercialDashboard";



function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/* ================= PAGE ACCUEIL ================= */}

                    <Route
                        path="/"
                        element={<Login />}
                    />


                    {/* ================= AUTH ================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    <Route
                        path="/pre-inscription"
                        element={<PreInscription />}
                    />



                    {/* ================= DASHBOARDS ================= */}


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





                    {/* ================= PROFIL ================= */}


                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "CLIENT",
                                    "COMMERCIAL",
                                    "FACTEUR"
                                ]}
                            >
                                <Profile />
                            </ProtectedRoute>
                        }
                    />





                    {/* ================= COMMERCIAUX ================= */}


                    <Route
                        path="/commercial/commerciaux"
                        element={<CommercialList />}
                    />


                    <Route
                        path="/commercial/commerciaux/nouveau"
                        element={<CommercialForm />}
                    />


                    <Route
                        path="/commercial/commerciaux/modifier/:id"
                        element={<CommercialForm />}
                    />





                    {/* ================= CLIENTS ================= */}


                    <Route
                        path="/commercial/clients"
                        element={<ClientList />}
                    />



                    <Route
                        path="/commercial/clients/:id/remise"
                        element={<ClientRemise />}
                    />





                    {/* ================= PRE-INSCRIPTIONS ================= */}


                    <Route
                        path="/commercial/preinscriptions"
                        element={<PreInscriptionList />}
                    />





                    {/* ================= CONTRATS ================= */}


                    <Route
                        path="/commercial/contrats"
                        element={<ContratList />}
                    />


                    <Route
                        path="/commercial/contrats/nouveau"
                        element={<ContratForm />}
                    />


                    <Route
                        path="/commercial/contrats/:id"
                        element={<ContratDetails />}
                    />


                    <Route
                        path="/commercial/contrats/modifier/:id"
                        element={<ContratForm />}
                    />





                    {/* ================= GRILLES REMISE ================= */}


                    <Route
                        path="/commercial/grilles-remise"
                        element={<GrilleRemiseList />}
                    />



                </Routes>


            </AuthProvider>


        </BrowserRouter>

    );

}


export default App;