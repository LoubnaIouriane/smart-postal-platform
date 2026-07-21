import { NavLink } from "react-router-dom";

const MENU = [

    {
        to: "/commercial/dashboard",
        label: "Tableau de bord",
        icon: "📊"
    },

    {
        to: "/commercial/clients",
        label: "Clients",
        icon: "👥"
    },

    {
        to: "/commercial/preinscriptions",
        label: "Demandes de pré-inscription",
        icon: "📝"
    },

    {
        to: "/commercial/contrats",
        label: "Contrats",
        icon: "📄"
    },

    {
        to: "/commercial/grilles-remise",
        label: "Grilles de remise",
        icon: "💳"
    },

    {
        to: "/commercial/commerciaux",
        label: "Commerciaux",
        icon: "🧑‍💼"
    }

];

export default function Sidebar() {

    return (

        <aside className="commercial-sidebar">

            <div className="commercial-logo">

                <span style={{ fontSize: 22 }}>📮</span>

                <div>

                    <strong>Smart Postal</strong>

                    <div style={{ fontSize: 13 }}>
                        Commercial
                    </div>

                </div>

            </div>

            {MENU.map((item) => (

                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `commercial-nav-item ${isActive ? "active" : ""}`
                    }
                >

                    <span>{item.icon}</span>

                    <span className="label">
                        {item.label}
                    </span>

                </NavLink>

            ))}

        </aside>

    );

}