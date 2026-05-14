export interface ProfileData {
  handle: string
  name: string
  bio: string
  followers: number
  following: number
  posts: number
  initials: string
  verified: boolean
  account_age_days: number
}

export interface AnalyticsData {
  tweet_count: number
  posting_frequency: number
  avg_engagement: number
  engagement_rate: number
  consistency_score: number
  avg_likes: number
  avg_retweets: number
  avg_replies: number
  top_post_likes: number
  thread_ratio: number
  media_ratio: number
  reply_ratio: number
  best_posting_hours: number[]
}

export interface ToneItem {
  label: string
  value: number
}

export interface TopicItem {
  label: string
  value: number
}

export interface TweetData {
  content: string
  likes: number
  retweets: number
  replies: number
  date: string
}

export interface PlayerData {
  profile: ProfileData
  analytics: AnalyticsData
  tone: ToneItem[]
  topics: TopicItem[]
  top_tweets: TweetData[]
}

export interface AIInsights {
  summary: string
  why_a_grows_faster: string[]
  recommendations_for_b: string[]
  creator_dna_a: string
  creator_dna_b: string
  underdog_handle: string
  underdog_tips: string[]
}

export interface CompareResult {
  a: PlayerData
  b: PlayerData
  ai_insights: AIInsights
}

export type CompareStep =
  | 'idle'
  | 'scraping_a'
  | 'done_a'
  | 'scraping_b'
  | 'done_b'
  | 'ai'
  | 'done_ai'
  | 'complete'
  | 'error'

export interface CompareState {
  step: CompareStep
  message: string
  playerA: PlayerData | null
  playerB: PlayerData | null
  result: CompareResult | null
  error: string | null
}
