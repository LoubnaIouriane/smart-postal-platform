import "./expedition.css";

const ETAPES = [
    { key: "EN_ATTENTE", label: "En attente" },
    { key: "VALIDEE", label: "Validée" },
    { key: "COLLECTEE", label: "Collectée" },
];

export default function StatusTimeline({ statut }) {
    if (statut === "ANNULEE") {
        return (
            <div className="timeline timeline-annulee">
                <span className="badge badge-annulee">Expédition annulée</span>
            </div>
        );
    }

    const indexActuel = ETAPES.findIndex((e) => e.key === statut);

    return (
        <div className="timeline">
            {ETAPES.map((etape, index) => (
                <div key={etape.key} className="timeline-step">
                    <div
                        className={
                            "timeline-dot " +
                            (index <= indexActuel ? "timeline-dot-active" : "")
                        }
                    >
                        {index < indexActuel ? "✓" : index + 1}
                    </div>
                    <span className="timeline-label">{etape.label}</span>
                    {index < ETAPES.length - 1 && (
                        <div
                            className={
                                "timeline-line " +
                                (index < indexActuel ? "timeline-line-active" : "")
                            }
                        />
                    )}
                </div>
            ))}
        </div>
    );
}