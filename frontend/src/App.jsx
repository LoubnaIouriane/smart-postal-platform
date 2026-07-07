import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import {
    AuthProvider
} from "./context/AuthContext";


import ProtectedRoute from "./components/auth/ProtectedRoute";


import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";



function App() {


    return (

        <AuthProvider>


            <BrowserRouter>


                <Routes>


                    {/* accueil */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />



                    {/* routes publiques */}


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





                    {/* dashboard protégé */}


                    <Route
                        path="/dashboard"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "CLIENT",
                                    "COMMERCIAL",
                                    "FACTEUR"
                                ]}
                            >

                                <Dashboard />

                            </ProtectedRoute>

                        }

                    />





                    {/* profil */}


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




                    {/* inconnue */}


                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                </Routes>


            </BrowserRouter>


        </AuthProvider>

    );

}


export default App;