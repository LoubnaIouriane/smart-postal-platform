import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminService.getStats().then(setStats).catch(() => setStats(null));
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ padding: "var(--space-xl)" }}>
                <h1 style={{ marginBottom: 24 }}>Tableau de bord — Administrateur</h1>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "var(--space-md)",
                    marginBottom: 32,
                }}>
                    <Card title="Clients">
                        <p style={{ fontSize: 32, fontWeight: 700 }}>{stats?.nombreClients ?? "…"}</p>
                    </Card>
                    <Card title="Commerciaux">
                        <p style={{ fontSize: 32, fontWeight: 700 }}>{stats?.nombreCommerciaux ?? "…"}</p>
                    </Card>
                    <Card title="Facteurs">
                        <p style={{ fontSize: 32, fontWeight: 700 }}>{stats?.nombreFacteurs ?? "…"}</p>
                    </Card>
                    <Card title="Agences">
                        <p style={{ fontSize: 32, fontWeight: 700 }}>{stats?.nombreAgences ?? "…"}</p>
                    </Card>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "var(--space-md)",
                }}>
                    <Link to="/admin/agences" style={{ textDecoration: "none", color: "inherit" }}>
                        <Card>
                            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Gérer les agences</h3>
                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
                                Ajouter, modifier, supprimer une agence
                            </p>
                        </Card>
                    </Link>
                    <Link to="/admin/commerciaux" style={{ textDecoration: "none", color: "inherit" }}>
                        <Card>
                            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Gérer les commerciaux</h3>
                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
                                Ajouter, modifier, supprimer un commercial
                            </p>
                        </Card>
                    </Link>
                    <Link to="/admin/facteurs" style={{ textDecoration: "none", color: "inherit" }}>
                        <Card>
                            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Gérer les facteurs</h3>
                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
                                Ajouter, modifier, supprimer un facteur
                            </p>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
}
