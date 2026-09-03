import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header({ title, description }) {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="commercial-header">
            <div className="header-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    onClick={() => navigate(-1)}
                    title="Retour"
                    style={{
                        background: "transparent",
                        border: "1px solid #DDE2E8",
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        cursor: "pointer",
                        fontSize: 16,
                    }}
                >
                    ⬅
                </button>
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>

            <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="notification-icon">🔔</div>

                <button
                    onClick={() => navigate("/profile")}
                    style={{
                        background: "transparent", border: "1px solid #0B3D6B", color: "#0B3D6B",
                        borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                >
                    👤 Mon profil
                </button>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#D9534F", border: "none", color: "#fff",
                        borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                >
                    🚪 Déconnexion
                </button>

                <div className="commercial-profile">
                    <div className="profile-avatar">👤</div>
                    <div className="profile-info">
                        <span>Commercial</span>
                        <small>{role}</small>
                    </div>
                </div>
            </div>
        </header>
    );
}