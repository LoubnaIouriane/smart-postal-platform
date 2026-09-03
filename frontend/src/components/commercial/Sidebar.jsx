import { NavLink } from "react-router-dom";

const MENU = [
    { to: "/commercial/dashboard", label: "Tableau de bord", icon: "📊" },
    { to: "/commercial/clients", label: "Clients", icon: "👥" },
    { to: "/commercial/preinscriptions", label: "Pré-inscriptions", icon: "📝" },
    { to: "/commercial/contrats", label: "Contrats", icon: "📄" },
    { to: "/commercial/grilles-remise", label: "Grilles de remise", icon: "💳" },
    { to: "/commercial/factures", label: "Factures", icon: "🧾" },
];

export default function Sidebar() {
    return (
        <aside className="commercial-sidebar">
            <div className="commercial-logo">
                <div className="logo-icon">📮</div>
                <div>
                    <strong>Smart Postal</strong>
                    <small>Commercial</small>
                </div>
            </div>

            <nav className="commercial-menu">
                {MENU.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `commercial-nav-item ${isActive ? "active" : ""}`}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}