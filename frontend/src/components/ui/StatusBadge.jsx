const STATUS_MAP = {
    PRE_INSCRIPTION: "pending", EN_ATTENTE: "pending",
    VALIDE: "success", VALIDEE: "success", ACTIF: "success",
    REFUSE: "danger", ANNULEE: "danger",
};

export default function StatusBadge({ statut }) {
    const kind = STATUS_MAP[statut] || "info";
    return <span className={`badge badge-${kind}`}>{statut}</span>;
}