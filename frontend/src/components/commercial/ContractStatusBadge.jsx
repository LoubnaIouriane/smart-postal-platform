const MAP = { ACTIF: "actif", EXPIRE: "expire", EN_ATTENTE: "attente" };

export default function ContractStatusBadge({ statut }) {
    const kind = MAP[statut] || "attente";
    return <span className={`commercial-badge commercial-badge-${kind}`}>{statut}</span>;
}