export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__wash" />
      <div className="atmosphere__orb atmosphere__orb--a" />
      <div className="atmosphere__orb atmosphere__orb--b" />
      <svg className="atmosphere__grid" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="stream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#163A32" stopOpacity="0" />
            <stop offset="45%" stopColor="#163A32" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7DFFB3" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 80 + i * 55
          return (
            <path
              key={i}
              className="atmosphere__stream"
              style={{ animationDelay: `${i * 0.35}s` }}
              d={`M-40 ${y} C 280 ${y - 40}, 520 ${y + 50}, 820 ${y - 10} S 1180 ${y + 30}, 1240 ${y}`}
              fill="none"
              stroke="url(#stream)"
              strokeWidth="1.2"
            />
          )
        })}
      </svg>
    </div>
  )
}
