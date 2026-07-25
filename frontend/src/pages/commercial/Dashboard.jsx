import { useEffect, useState } from "react";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import StatCard from "../../components/commercial/StatCard";
import { getClients, getContrats, getGrilles } from "../../services/commercialApi";

export default function Dashboard() {
    const [stats, setStats] = useState({ clients: 0, contrats: 0, grilles: 0 });

    useEffect(() => {
        Promise.all([getClients(), getContrats(), getGrilles()]).then(
            ([clients, contrats, grilles]) =>
                setStats({ clients: clients.length, contrats: contrats.length, grilles: grilles.length })
        );
    }, []);

    return (
        <CommercialLayout title="Tableau de bord" description="Vue d'ensemble de l'activite commerciale">
            <div className="commercial-stat-grid">
                <StatCard icon="👥" value={stats.clients} label="Clients" color="#0057B8" />
                <StatCard icon="📄" value={stats.contrats} label="Contrats actifs" color="#FFD200" />
                <StatCard icon="💳" value={stats.grilles} label="Grilles de remise" color="#2F9E63" />
            </div>
        </CommercialLayout>
    );
}