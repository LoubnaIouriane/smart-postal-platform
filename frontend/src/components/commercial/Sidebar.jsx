import { NavLink } from "react-router-dom";

const MENU = [
    { to: "/commercial/dashboard", label: "Tableau de bord", icon: "📊" },
    { to: "/commercial/clients", label: "Clients", icon: "👥" },
    { to: "/commercial/contrats", label: "Contrats", icon: "📄" },
    { to: "/commercial/commerciaux", label: "Commerciaux", icon: "🧑‍💼" },
    { to: "/commercial/grilles-remise", label: "Grilles de remise", icon: "💳" },
];

export default function Sidebar() {
    return (
        <aside className="commercial-sidebar">
            <div className="commercial-sidebar-logo">
                <span style={{ fontSize: 22 }}>📮</span>
                <span>Smart Postal — Commercial</span>
            </div>

            {MENU.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `commercial-nav-item ${isActive ? "active" : ""}`}
                >
                    <span>{item.icon}</span>
                    <span className="label">{item.label}</span>
                </NavLink>
            ))}
        </aside>
    );
}