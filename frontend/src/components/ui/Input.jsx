export default function Input({ label, ...props }) {
    return (
        <div style={{ marginBottom: "var(--space-md)" }}>
            {label && <label className="field-label">{label}</label>}
            <input className="field-input" {...props} />
        </div>
    );
}