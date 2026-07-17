export default function StatCard({ icon, value, label, color = "var(--c-blue)" }) {
    return (
        <div className="commercial-stat-card">
            <div className="commercial-stat-icon" style={{ background: color }}>{icon}</div>
            <div>
                <p className="commercial-stat-value">{value}</p>
                <p className="commercial-stat-label">{label}</p>
            </div>
        </div>
    );
}