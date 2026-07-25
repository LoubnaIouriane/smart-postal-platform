import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../ui/BrandMark";

const LINKS = [
    { to: "/admin/dashboard", label: "Tableau de bord", icon: "📊" },
    { to: "/admin/agences", label: "Agences", icon: "🏢" },
    { to: "/admin/commerciaux", label: "Commerciaux", icon: "🧑‍💼" },
    { to: "/admin/facteurs", label: "Facteurs", icon: "📮" },
];

export default function Sidebar() {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <BrandMark size={32} />
                <span>Smart Postal</span>
            </div>

            <nav className="sidebar-nav">
                {LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/profile" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                    <span className="sidebar-icon">👤</span> Mon profil
                </NavLink>
                <div className="sidebar-role">Connecté en tant que <strong>{role}</strong></div>
                <button className="sidebar-logout" onClick={handleLogout}>⏻ Se déconnecter</button>
            </div>
        </aside>
    );
}
