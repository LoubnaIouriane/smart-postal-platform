import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminService.getStats().then(setStats).catch(() => setStats(null));
    }, []);

    const cards = [
        { label: "Clients", value: stats?.nombreClients, to: null },
        { label: "Commerciaux", value: stats?.nombreCommerciaux, to: "/admin/commerciaux" },
        { label: "Facteurs", value: stats?.nombreFacteurs, to: "/admin/facteurs" },
        { label: "Agences", value: stats?.nombreAgences, to: "/admin/agences" },
    ];

    return (
        <AdminLayout>
            <h1>Tableau de bord</h1>
            <p className="page-subtitle">Vue d'ensemble de la plateforme Smart Postal Platform</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
                {cards.map((c) => {
                    const content = (
                        <div className="stat-card" key={c.label}>
                            <div className="stat-label">{c.label}</div>
                            <div className="stat-value">{c.value ?? "…"}</div>
                        </div>
                    );
                    return c.to ? (
                        <Link key={c.label} to={c.to} style={{ textDecoration: "none" }}>{content}</Link>
                    ) : content;
                })}
            </div>
        </AdminLayout>
    );
}
