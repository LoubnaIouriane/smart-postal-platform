export default function BrandMark({ size = 44 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="var(--color-primary)" />
            <path
                d="M18 26 L32 36 L46 26"
                stroke="#FFC72C"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <rect x="16" y="20" width="32" height="22" rx="3"
                  stroke="#FFC72C" strokeWidth="4" fill="none" />
        </svg>
    );
}