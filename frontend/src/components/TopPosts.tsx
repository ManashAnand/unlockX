import MirrorGrid from './MirrorGrid'
import Card from './Card'
import type { PlayerData, TweetData } from '@/lib/types'

function PostCard({ tweet, side }: { tweet: TweetData; side: 'a' | 'b' }) {
  const color = side === 'a' ? 'text-player-a' : 'text-player-b'
  return (
    <Card side={side}>
      <div className="flex flex-col gap-3">
        <p className="line-clamp-3 text-sm leading-relaxed text-primary">{tweet.content}</p>
        <span className="font-mono text-[11px] text-tertiary">{tweet.date}</span>
        {/* Engagement bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <span
            className={`${side === 'a' ? 'bar-fill-a' : 'bar-fill-b'} absolute left-0 top-0 h-full rounded-full`}
            style={{ width: '100%', transition: 'width 900ms cubic-bezier(0.2,0.7,0.2,1)' }}
          />
        </div>
        {/* Stats */}
        <div className="flex items-center gap-4">
          {[
            { label: 'LIKES', value: tweet.likes },
            { label: 'RTS', value: tweet.retweets },
            { label: 'REPLIES', value: tweet.replies },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-tertiary">{label}</div>
              <div className={`font-mono text-sm tabular-nums font-medium ${color}`}>
                {value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

type Props = { playerA: PlayerData; playerB: PlayerData }

export default function TopPosts({ playerA, playerB }: Props) {
  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Content</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Top Posts</h2>
      </div>
      <div className="space-y-4">
        {Array.from({ length: Math.max(playerA.top_tweets.length, playerB.top_tweets.length) }).map((_, i) => (
          <MirrorGrid key={i}>
            {playerA.top_tweets[i] && <PostCard tweet={playerA.top_tweets[i]} side="a" />}
            {playerB.top_tweets[i] && <PostCard tweet={playerB.top_tweets[i]} side="b" />}
          </MirrorGrid>
        ))}
      </div>
    </div>
  )
}
