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

          {/* Padel racket — solid perforated face, short thick grip */}
          <g className="padel-loader-racket">
            {/* Handle / grip */}
            <path
              d="M72 96 C72 92, 74 90, 80 90 C86 90, 88 92, 88 96 L86 138 C86 142, 83 144, 80 144 C77 144, 74 142, 74 138 Z"
              fill="#1a2a30"
              stroke="var(--primary)"
              strokeWidth="2"
            />
            {/* Grip wrap lines */}
            <path
              d="M75 104 H85 M75 112 H85 M75 120 H85 M75 128 H85"
              stroke="#243840"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Butt cap */}
            <ellipse
              cx="80"
              cy="144"
              rx="8"
              ry="4"
              fill="#0f1c20"
              stroke="var(--primary)"
              strokeWidth="1.5"
            />

            {/* Thick frame + solid face (teardrop padel shape) */}
            <path
              d="M80 10
                 C102 10, 118 28, 118 52
                 C118 72, 108 86, 96 92
                 L88 96 L72 96 L64 92
                 C52 86, 42 72, 42 52
                 C42 28, 58 10, 80 10 Z"
              fill="#0f1c20"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Inner face plate */}
            <path
              d="M80 18
                 C98 18, 110 32, 110 50
                 C110 66, 102 78, 92 84
                 L80 88 L68 84
                 C58 78, 50 66, 50 50
                 C50 32, 62 18, 80 18 Z"
              fill="#152428"
              stroke="var(--color-blue)"
              strokeWidth="1"
              opacity="0.9"
            />

            {/* Perforated holes — signature padel face */}
            <g fill="#030708">
              {/* Row 1 */}
              <circle cx="68" cy="32" r="3.2" />
              <circle cx="80" cy="30" r="3.2" />
              <circle cx="92" cy="32" r="3.2" />
              {/* Row 2 */}
              <circle cx="62" cy="44" r="3.2" />
              <circle cx="74" cy="42" r="3.2" />
              <circle cx="86" cy="42" r="3.2" />
              <circle cx="98" cy="44" r="3.2" />
              {/* Row 3 */}
              <circle cx="62" cy="56" r="3.2" />
              <circle cx="74" cy="54" r="3.2" />
              <circle cx="86" cy="54" r="3.2" />
              <circle cx="98" cy="56" r="3.2" />
              {/* Row 4 */}
              <circle cx="68" cy="66" r="3.2" />
              <circle cx="80" cy="68" r="3.2" />
              <circle cx="92" cy="66" r="3.2" />
              {/* Row 5 */}
              <circle cx="74" cy="78" r="2.8" />
              <circle cx="86" cy="78" r="2.8" />
            </g>
          </g>

          {/* Padel ball */}
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
