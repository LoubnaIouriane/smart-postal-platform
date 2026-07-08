export default function Button({ children, variant = "primary", block = true, ...props }) {
    return (
        <button className={`btn btn-${variant} ${block ? "btn-block" : ""}`} {...props}>
            {children}
        </button>
    );
}