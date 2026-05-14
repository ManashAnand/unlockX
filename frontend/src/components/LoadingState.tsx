type Props = { message: string; step: string }

export default function LoadingState({ message, step }: Props) {
  const steps = ['scraping_a', 'done_a', 'scraping_b', 'done_b', 'ai', 'done_ai']
  const currentIdx = steps.indexOf(step)

  return (
    <div className="flex flex-col items-center gap-8 py-20">
      {/* Animated dots */}
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 animate-ping rounded-full bg-player-a" style={{ animationDelay: '0ms' }} />
        <div className="h-1.5 w-1.5 animate-ping rounded-full bg-tertiary" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 animate-ping rounded-full bg-player-b" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Message */}
      <p className="font-mono text-[11px] uppercase tracking-widest text-tertiary">{message}</p>

      {/* Progress steps */}
      <div className="flex flex-col gap-2 text-left">
        {[
          { key: 'scraping_a', label: 'Fetch Creator A tweets' },
          { key: 'scraping_b', label: 'Fetch Creator B tweets' },
          { key: 'ai',         label: 'Generate AI insights' },
        ].map(({ key, label }) => {
          const done = currentIdx > steps.indexOf(key)
          const active = step === key || (key === 'scraping_a' && step === 'done_a') || (key === 'scraping_b' && step === 'done_b') || (key === 'ai' && step === 'done_ai')
          return (
            <div key={key} className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-success' : active ? 'bg-accent animate-pulse' : 'bg-muted'}`} />
              <span className={`font-mono text-xs ${done ? 'text-success' : active ? 'text-primary' : 'text-muted'}`}>
                {done ? '✓ ' : ''}{label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
