export default function Input({ label, ...props }) {
    return (
        <div style={{ marginBottom: "var(--space-md)" }}>
            {label && (
                <label style={{ display: "block", marginBottom: "var(--space-xs)",
                    fontSize: "13px", color: "var(--color-text-muted)", fontWeight: 500 }}>
                    {label}
                </label>
            )}
            <input className="field-input" {...props} />
        </div>
    );
}