const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export function streamCompare(
  handleA: string,
  handleB: string,
  onEvent: (event: string, data: unknown) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const url = `${API_BASE}/api/compare/stream?handle_a=${encodeURIComponent(handleA)}&handle_b=${encodeURIComponent(handleB)}`
  const es = new EventSource(url)

  const EVENTS = ['status', 'profile', 'complete', 'error']
  EVENTS.forEach((evt) => {
    es.addEventListener(evt, (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        onEvent(evt, data)
        if (evt === 'complete' || evt === 'error') {
          es.close()
          if (evt === 'complete') onDone()
          else onError(data.message ?? 'Unknown error')
        }
      } catch {
        onError('Failed to parse server response')
        es.close()
      }
    })
  })

  es.onerror = () => {
    onError('Connection to backend lost')
    es.close()
  }

  return () => es.close()
}
