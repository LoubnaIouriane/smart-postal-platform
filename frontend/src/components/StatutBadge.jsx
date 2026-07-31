function StatutBadge({ statut }) {
  const isPayee = statut === "PAYEE";

  return (
    <span className={`status-badge ${isPayee ? "status-paid" : "status-unpaid"}`}>
      {isPayee ? "Payee" : "Non payee"}
    </span>
  );
}

export default StatutBadge;
