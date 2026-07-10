export default function Select({ label, children, ...props }) {
    return (
        <div style={{ marginBottom: "var(--space-md)" }}>
            {label && <label className="field-label">{label}</label>}
            <select className="field-select" {...props}>
                {children}
            </select>
        </div>
    );
}
