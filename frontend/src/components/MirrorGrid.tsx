import type { ReactNode } from 'react'

export default function MirrorGrid({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
      <div
        className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 md:block"
        style={{ background: 'linear-gradient(180deg, transparent, var(--stroke-soft) 20%, var(--stroke-soft) 80%, transparent)' }}
      />
      {children}
    </div>
  )
}
