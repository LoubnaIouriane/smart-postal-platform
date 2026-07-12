import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD

import CommercialList from "./pages/commercial/CommercialList";


function App() {

  return (
      <BrowserRouter>

        <Routes>

          <Route
              path="/commercial/liste"
              element={<CommercialList />}
          />

        </Routes>

      </BrowserRouter>
  );
=======
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Dashboard from "./pages/auth/Dashboard";
import Profile from "./pages/auth/Profile";

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
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
>>>>>>> origin/feature/auth
}

export default App;