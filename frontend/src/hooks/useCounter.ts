import { useEffect, useRef, useState } from 'react'

export function useCounter(
  target: number,
  active: boolean,
  duration = 1400,
  decimals = 0,
): string {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    startTime.current = null
    let raf = 0
    const tick = (t: number) => {
      if (startTime.current == null) startTime.current = t
      const k = Math.min(1, (t - startTime.current) / duration)
      const eased = 1 - Math.pow(1 - k, 3)
      setValue(target * eased)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  if (decimals > 0) return value.toFixed(decimals)
  return Math.round(value).toLocaleString()
}
