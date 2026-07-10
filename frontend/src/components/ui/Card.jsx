export default function Card({ title, children, style = {} }) {
    return (
        <div className="card-surface" style={{ padding: "var(--space-lg)", ...style }}>
            {title && <h3 style={{ marginBottom: "var(--space-md)", fontSize: 16 }}>{title}</h3>}
            {children}
        </div>
    );
}