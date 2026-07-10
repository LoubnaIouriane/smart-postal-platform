import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../../components/ui/BrandMark";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (identifiant, motDePasse) => {
        setLoading(true);
        setError("");
        try {
            const data = await login(identifiant, motDePasse);
            if (data.role === "CLIENT") navigate("/client/dashboard");
            else if (data.role === "COMMERCIAL") navigate("/commercial/dashboard");
            else if (data.role === "FACTEUR") navigate("/facteur/dashboard");
            else navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Identifiant ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", display: "grid",
            gridTemplateColumns: "1fr 1fr",
        }}>
            {/* Panneau de marque - jaune */}
            <div className="brand-panel">
                <BrandMark size={84} />
                <h1 style={{ marginTop: 20, fontSize: 26 }}>Smart Postal Platform</h1>
                <p style={{ color: "var(--gray-900)", marginTop: 8, maxWidth: 320 }}>
                    La plateforme de gestion des expéditions courrier de Barid Al-Maghrib.
                </p>
            </div>

            {/* Panneau formulaire - blanc/gris */}
            <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "var(--color-bg)", padding: "var(--space-xl)",
            }}>
                <div className="card-surface" style={{ padding: "var(--space-xl)", width: "100%", maxWidth: 400 }}>
                    <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

                    <p style={{ marginTop: 20, fontSize: 14, color: "var(--color-text-muted)", textAlign: "center" }}>
                        Pas encore de compte ?{" "}
                        <Link to="/pre-inscription" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}