import { useAuth } from "../../context/AuthContext"; // import du contexte d'Etudiant 1

export default function Header({ title, description }) {
    const { role } = useAuth();

    return (
        <header className="commercial-header">
            <div>
                <h1>{title}</h1>
                {description && <p>{description}</p>}
            </div>

            <div className="commercial-header-right">
                <input className="commercial-search" placeholder="Rechercher..." />
                <span style={{ fontSize: 18 }}>🔔</span>
                <div className="commercial-avatar">{role ? role[0] : "?"}</div>
                <div style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>Commercial</div>
                    <div style={{ color: "var(--c-text-muted)" }}>{role}</div>
                </div>
            </div>
        </header>
    );
}