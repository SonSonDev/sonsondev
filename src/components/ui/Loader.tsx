import '@/assets/stylesheets/loader.scss'

interface Props {
  size?: number
}

export default function Loader({ size = 32 }: Props) {
  const stroke = size / 8
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  return (
    <span className="loader" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          opacity={0.15}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
        />
      </svg>
    </span>
  )
}
