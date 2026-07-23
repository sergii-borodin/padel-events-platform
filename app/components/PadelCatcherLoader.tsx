type PadelCatcherLoaderProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md";
  /** Full-viewport backdrop for async actions (submit, auth, booking). */
  overlay?: boolean;
};

const SIZES = {
  sm: 72,
  md: 140,
} as const;

const PadelCatcherLoader = ({
  label = "Loading…",
  className = "",
  size = "md",
  overlay = false,
}: PadelCatcherLoaderProps) => {
  const px = SIZES[size];

  const content = (
    <div
      className={`padel-loader flex-center flex-col gap-6 ${size === "sm" ? "py-4 gap-3" : "py-24"} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true">
      <div className="padel-loader-stage" aria-hidden="true">
        <svg
          className="padel-loader-svg"
          viewBox="0 0 160 160"
          width={px}
          height={px}
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <ellipse
            className="padel-loader-glow"
            cx="80"
            cy="132"
            rx="46"
            ry="10"
            fill="var(--primary)"
            opacity="0.18"
          />

          <g className="padel-loader-racket">
            <rect
              x="72"
              y="88"
              width="16"
              height="42"
              rx="5"
              fill="#1a2a30"
              stroke="var(--primary)"
              strokeWidth="2"
            />
            <rect x="76" y="94" width="8" height="28" rx="3" fill="#243840" />
            <ellipse
              cx="80"
              cy="52"
              rx="36"
              ry="42"
              fill="#0f1c20"
              stroke="var(--primary)"
              strokeWidth="3.5"
            />
            <ellipse
              cx="80"
              cy="52"
              rx="28"
              ry="34"
              stroke="var(--color-blue)"
              strokeWidth="1.25"
              opacity="0.55"
            />
            <path
              d="M58 36 H102 M58 48 H102 M58 60 H102 M58 72 H102 M66 22 V82 M80 18 V86 M94 22 V82"
              stroke="var(--primary)"
              strokeWidth="1"
              opacity="0.35"
            />
          </g>

          <g className="padel-loader-ball">
            <circle cx="80" cy="24" r="10" fill="var(--primary)" />
            <path
              d="M74 20 C78 22, 82 22, 86 20"
              stroke="#0d161a"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
            <path
              d="M74 28 C78 26, 82 26, 86 28"
              stroke="#0d161a"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
          </g>
        </svg>
      </div>

      <p
        className={`text-light-200 font-martian-mono tracking-wide ${size === "sm" ? "text-xs" : "text-sm"}`}>
        {label}
      </p>
    </div>
  );

  if (!overlay) return content;

  return (
    <div className="padel-loader-overlay" aria-hidden={false}>
      {content}
    </div>
  );
};

export default PadelCatcherLoader;
