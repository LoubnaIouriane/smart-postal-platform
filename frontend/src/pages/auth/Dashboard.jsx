import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";

const MENUS = {
    CLIENT: [
        { label: "Nouvelle expédition", desc: "Créer une nouvelle demande d'envoi" },
        { label: "Mes expéditions", desc: "Suivre l'état de mes colis" },
        { label: "Mes factures", desc: "Consulter mon historique de facturation" },
        { label: "Mon profil", desc: "Modifier mes informations" },
    ],
    COMMERCIAL: [
        { label: "Pré-inscriptions", desc: "Valider ou refuser les demandes clients" },
        { label: "Grilles de remise", desc: "Gérer les taux de remise par contrat" },
        { label: "Liste des clients", desc: "Consulter le portefeuille client" },
    ],
    FACTEUR: [
        { label: "Collectes du jour", desc: "Expéditions à récupérer" },
        { label: "Vérification poids", desc: "Contrôler le poids réel des colis" },
        { label: "Validation collecte", desc: "Confirmer la prise en charge" },
    ],
};

export default function Dashboard() {
    const { role } = useAuth();
    const items = MENUS[role] || [];

    return (
        <>
            <Navbar />
            <div style={{ padding: "var(--space-xl)" }}>
                <h1 style={{ marginBottom: 24 }}>Tableau de bord — {role}</h1>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "var(--space-md)",
                }}>
                    {items.map((item) => (
                        <Card key={item.label}>
                            <h3 style={{ fontSize: 16, marginBottom: 8 }}>{item.label}</h3>
                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}