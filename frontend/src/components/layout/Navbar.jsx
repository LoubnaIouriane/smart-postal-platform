import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../ui/BrandMark";

export default function Navbar() {
    const { isAuthenticated, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="navbar">
            <div className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {isAuthenticated && (
                    <button
                        onClick={() => navigate(-1)}
                        title="Retour"
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(0,0,0,0.15)",
                            borderRadius: 8,
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            fontSize: 15,
                        }}
                    >
                        ⬅
                    </button>
                )}
                <BrandMark size={36} />
                <span className="navbar-title">Smart Postal Platform</span>
            </div>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        {role === "ADMIN" && (
                            <>
                                <a href="/admin/dashboard">Tableau de bord</a>
                                <a href="/admin/agences">Agences</a>
                                <a href="/admin/commerciaux">Commerciaux</a>
                                <a href="/admin/facteurs">Facteurs</a>
                            </>
                        )}
                        <span style={{ fontSize: 13, color: "var(--gray-900)" }}>Rôle : {role}</span>
                        <a href="/profile">Mon profil</a>
                        <button onClick={handleLogout}>Se déconnecter</button>
                    </>
                ) : (
                    <a href="/login">Connexion</a>
                )}
            </div>
        </div>
    );
}