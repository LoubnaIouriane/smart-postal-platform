<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";

=======
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
>>>>>>> origin/feature/facturation
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ================= AUTH =================

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";
import CommercialList from "./pages/commercial/CommercialList";
import FactureDetail from "./pages/facturation/FactureDetail";
import FactureForm from "./pages/facturation/FactureForm";
import FactureHistorique from "./pages/facturation/FactureHistorique";
import FactureList from "./pages/facturation/FactureList";

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
<<<<<<< HEAD
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

                    {/* ================= ADMIN ================= */}

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/agences"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/commerciaux"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <CommercialList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/facteurs"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
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
                                    "ADMIN",
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
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/commerciaux/nouveau"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/commerciaux/modifier/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <CommercialForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= CLIENTS ================= */}

                    <Route
                        path="/commercial/clients"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ClientList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/clients/:id/remise"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ClientRemise />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= PRE-INSCRIPTIONS ================= */}

                    <Route
                        path="/commercial/preinscriptions"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <PreInscriptionList />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= CONTRATS ================= */}

                    <Route
                        path="/commercial/contrats"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/contrats/nouveau"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/contrats/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/contrats/modifier/:id"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <ContratForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= GRILLES DE REMISE ================= */}

                    <Route
                        path="/commercial/grilles-remise"
                        element={
                            <ProtectedRoute allowedRoles={["COMMERCIAL"]}>
                                <GrilleRemiseList />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;


                    {/* ================= GRILLES REMISE ================= */}


                    <Route
                        path="/commercial/grilles-remise"
                        element={<GrilleRemiseList />}
                    />



>>>>>>> feature/zaineb
                </Routes>


            </AuthProvider>


        </BrowserRouter>

    );

}

<<<<<<< HEAD
export default App;
=======

export default App;
>>>>>>> feature/zaineb
=======
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
          <Route path="/factures/nouvelle" element={<FactureForm />} />
          <Route path="/factures/:id" element={<FactureDetail />} />
          <Route path="/commercial/factures" element={<FactureList />} />
          <Route path="/commercial/factures/nouvelle" element={<FactureForm />} />
          <Route path="/commercial/factures/:id" element={<FactureDetail />} />
          <Route path="/client/factures" element={<FactureHistorique />} />
          <Route path="/client/factures/:id" element={<FactureDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
>>>>>>> origin/feature/facturation
