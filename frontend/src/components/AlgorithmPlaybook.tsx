import type { CompareResult, PlayerData } from '@/lib/types'

type Props = { result: CompareResult }

type Tip = {
  rule: string
  status: 'good' | 'warn' | 'bad'
  metric: string
  action: string
  icon: string
}

function grade(val: number, good: number, warn: number): 'good' | 'warn' | 'bad' {
  if (val >= good) return 'good'
  if (val >= warn) return 'warn'
  return 'bad'
}

function buildTips(p: PlayerData, handle: string): Tip[] {
  const a = p.analytics
  const tips: Tip[] = []

  // 1. Engagement rate
  const engGrade = grade(a.engagement_rate, 1.0, 0.4)
  tips.push({
    rule: 'Engagement Rate',
    status: engGrade,
    metric: `${a.engagement_rate.toFixed(2)}% (X targets >1% for growth boost)`,
    action: engGrade === 'good'
      ? 'Keep it up — X is pushing your content harder because of this.'
      : engGrade === 'warn'
      ? `${handle} is near the threshold. Try ending posts with a question to pull replies.`
      : `${handle}'s ${a.engagement_rate.toFixed(2)}% is below the boost floor. Ask direct questions, run polls, reply to every comment for 30 min after posting.`,
    icon: '⚡',
  })

  // 2. Posting frequency
  const freqGrade = a.posting_frequency >= 1 ? 'good' : a.posting_frequency >= 0.3 ? 'warn' : 'bad'
  tips.push({
    rule: 'Posting Frequency',
    status: freqGrade,
    metric: `${a.posting_frequency.toFixed(2)} posts/day (X sweet spot: 1–3/day)`,
    action: freqGrade === 'good'
      ? 'Cadence is in the sweet spot. Stay consistent — the algorithm rewards accounts that post regularly.'
      : freqGrade === 'warn'
      ? `${handle} posts every few days. Aim for at least 1 original post daily; even short takes count.`
      : `${handle} posts rarely. X's algorithm deprioritizes inactive accounts. Schedule 1 post minimum each day — use drafts or a scheduler.`,
    icon: '📅',
  })

  // 3. Reply ratio (engagement bait)
  const replyGrade = grade(a.reply_ratio * 100, 3, 1)
  tips.push({
    rule: 'Reply Ratio',
    status: replyGrade,
    metric: `${(a.reply_ratio * 100).toFixed(1)}% of posts generate replies (target >3%)`,
    action: replyGrade === 'good'
      ? 'Conversations are happening. X treats replies as the strongest positive signal.'
      : `${handle} gets few replies. The new X algorithm weights replies 3× more than likes. Start threads with a hot take or a debatable statement to invite pushback.`,
    icon: '💬',
  })

  // 4. Media ratio
  const mediaGrade = grade(a.media_ratio * 100, 40, 20)
  tips.push({
    rule: 'Media Usage',
    status: mediaGrade,
    metric: `${(a.media_ratio * 100).toFixed(0)}% of posts include media (X boosts 40–60%)`,
    action: mediaGrade === 'good'
      ? 'Good media mix. X reports images/videos get 3× more impressions than text-only.'
      : `${handle} posts mostly text. X's recommendation engine gives a ~3× impression boost to posts with images or video. Add even a simple chart or screenshot.`,
    icon: '🖼️',
  })

  // 5. Consistency score
  const consGrade = grade(a.consistency_score, 70, 40)
  tips.push({
    rule: 'Posting Consistency',
    status: consGrade,
    metric: `Consistency score: ${a.consistency_score}/100 (X rewards predictable accounts)`,
    action: consGrade === 'good'
      ? 'Consistent schedule detected. The algorithm rewards predictable accounts with wider distribution.'
      : consGrade === 'warn'
      ? `${handle}'s posting is irregular. X's algorithm learns your active windows — post at the same 2–3 times every day to train it.`
      : `${handle} posts unpredictably. X's algorithm downgrades accounts that go quiet for days then spike. Pick 2 fixed posting times and stick to them for 30 days.`,
    icon: '📊',
  })

  // 6. Thread ratio
  const threadGrade = grade(a.thread_ratio * 100, 10, 3)
  tips.push({
    rule: 'Thread Content',
    status: threadGrade,
    metric: `${(a.thread_ratio * 100).toFixed(0)}% threads (X gives threads 5× wider reach)`,
    action: threadGrade === 'good'
      ? 'Good thread usage. Threads keep people on the platform longer — X rewards this heavily.'
      : `${handle} rarely uses threads. X's 2024 algorithm gives threads 5× wider distribution because they increase dwell time. Convert your best text posts into 3–5 tweet threads.`,
    icon: '🧵',
  })

  // 7. No external links tip (universal for low-frequency posters)
  tips.push({
    rule: 'No Links in Main Post',
    status: a.posting_frequency < 1 ? 'warn' : 'good',
    metric: 'X suppresses posts with external URLs in the body',
    action: `Put any links in the first reply instead of the main tweet. X's algorithm cuts reach by ~50% for posts with outbound links. ${handle} should move all URLs to replies.`,
    icon: '🔗',
  })

  // 8. Best time to post
  const hours = a.best_posting_hours
  const timeStr = hours.length > 0
    ? hours.slice(0, 3).map(h => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`).join(', ')
    : '9am, 12pm, 5pm'
  tips.push({
    rule: 'Optimal Posting Times',
    status: 'warn',
    metric: `Based on your past engagement: ${timeStr}`,
    action: `${handle}'s audience is most active around ${timeStr}. The first 30 minutes of a post determine total reach — always post within these windows and engage every reply immediately after.`,
    icon: '🕐',
  })

  return tips
}

const statusColors = {
  good: {
    border: 'rgba(74,222,128,0.20)',
    bg: 'rgba(74,222,128,0.04)',
    dot: '#4ade80',
    label: 'On track',
    labelColor: '#4ade80',
  },
  warn: {
    border: 'rgba(250,204,21,0.20)',
    bg: 'rgba(250,204,21,0.04)',
    dot: '#facc15',
    label: 'Needs work',
    labelColor: '#facc15',
  },
  bad: {
    border: 'rgba(248,113,113,0.22)',
    bg: 'rgba(248,113,113,0.04)',
    dot: '#f87171',
    label: 'Critical',
    labelColor: '#f87171',
  },
}

export default function AlgorithmPlaybook({ result }: Props) {
  const underdogHandle = result.ai_insights.underdog_handle
  const underdog: PlayerData =
    result.a.profile.handle === underdogHandle ||
    result.a.profile.handle.replace('@', '') === underdogHandle.replace('@', '')
      ? result.a
      : result.b

  const handle = underdog.profile.handle
  const tips = buildTips(underdog, handle)

  const good = tips.filter(t => t.status === 'good').length
  const bad = tips.filter(t => t.status === 'bad').length
  const warn = tips.filter(t => t.status === 'warn').length

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">X Algorithm</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">
          Algorithm Playbook
        </h2>
      </div>

      {/* Banner */}
      <div
        className="mb-5 rounded-xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(10,10,30,0.8) 100%)',
          border: '1px solid rgba(100,140,255,0.18)',
          boxShadow: '0 0 40px -15px rgba(80,100,255,0.20)',
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-sans text-base font-semibold text-primary">
              Personalised for{' '}
              <span style={{ color: 'var(--player-b)' }}>{handle}</span>
            </p>
            <p className="mt-0.5 font-mono text-xs text-tertiary">
              Based on your actual metrics vs what the new X algorithm rewards in 2025
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="font-mono text-lg font-semibold" style={{ color: '#4ade80' }}>{good}</p>
              <p className="font-mono text-[10px] text-tertiary">Good</p>
            </div>
            <div className="h-8 w-px bg-soft" />
            <div className="text-center">
              <p className="font-mono text-lg font-semibold" style={{ color: '#facc15' }}>{warn}</p>
              <p className="font-mono text-[10px] text-tertiary">Fix soon</p>
            </div>
            <div className="h-8 w-px bg-soft" />
            <div className="text-center">
              <p className="font-mono text-lg font-semibold" style={{ color: '#f87171' }}>{bad}</p>
              <p className="font-mono text-[10px] text-tertiary">Critical</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tips.map((tip) => {
          const c = statusColors[tip.status]
          return (
            <div
              key={tip.rule}
              className="flex flex-col gap-3 rounded-xl p-4"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{tip.icon}</span>
                  <span className="font-mono text-[11px] font-semibold text-primary">{tip.rule}</span>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide flex-shrink-0"
                  style={{ background: `${c.dot}18`, color: c.labelColor, border: `1px solid ${c.dot}30` }}
                >
                  <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                  {c.label}
                </span>
              </div>

              {/* Metric */}
              <p className="font-mono text-[10px] leading-relaxed text-tertiary border-l-2 pl-2" style={{ borderColor: c.dot }}>
                {tip.metric}
              </p>

              {/* Action */}
              <p className="text-xs text-secondary leading-relaxed mt-auto">{tip.action}</p>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <p className="mt-4 font-mono text-[10px] text-muted text-center">
        Based on X&apos;s publicly documented 2024–25 algorithm signals. Tips are generated from {handle}&apos;s actual post metrics.
      </p>
    </div>
  )
}
