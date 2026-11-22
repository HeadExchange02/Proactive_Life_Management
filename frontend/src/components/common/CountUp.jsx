import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'

const NUMBER_PATTERN = /^([\d,]+(?:\.\d+)?)(.*)$/

export default function CountUp({ value, duration = 1400 }) {
  const match = NUMBER_PATTERN.exec(String(value))
  const [ref, inView] = useInView({ threshold: 0.4 })
  const [current, setCurrent] = useState(0)

  const hasNumber = Boolean(match)
  const target = match ? parseFloat(match[1].replace(/,/g, '')) : 0
  const useCommas = match ? match[1].includes(',') : false

  useEffect(() => {
    if (!hasNumber || !inView) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return undefined
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCurrent(target * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration, hasNumber])

  if (!match) return <span>{value}</span>

  const rounded = Math.round(current)
  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="sr-only">{value}</span>
      {/* Invisible final value reserves the width so the layout never shifts while counting. */}
      <span aria-hidden="true" className="invisible">{value}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {useCommas ? rounded.toLocaleString('en-US') : rounded}
        {match[2]}
      </span>
    </span>
  )
}
