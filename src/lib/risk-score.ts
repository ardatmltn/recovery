/**
 * Risk score algorithm — 0 to 100 (higher = more at risk of churn)
 *
 * Factors:
 * - failureCount: number of failed payments (max 40 pts)
 * - recentFailure: failure in last 7 days (20 pts)
 * - noRecovery: never recovered a payment (25 pts)
 * - highAmount: failed amount > 10000 cents ($100) (15 pts)
 */
export function calculateRiskScore({
  failureCount,
  recoveredCount,
  lastFailedAt,
  totalFailedAmount,
}: {
  failureCount: number
  recoveredCount: number
  lastFailedAt: string | null
  totalFailedAmount: number
}): number {
  let score = 0

  // Failure count — 10 pts per failure, max 40
  score += Math.min(failureCount * 10, 40)

  // Recent failure — failure within last 7 days adds 20 pts
  if (lastFailedAt) {
    const daysSince = (Date.now() - new Date(lastFailedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince <= 7) score += 20
  }

  // No recovery — never recovered a payment adds 25 pts
  if (failureCount > 0 && recoveredCount === 0) score += 25

  // High amount at risk — >$100 total failed adds 15 pts
  if (totalFailedAmount > 10000) score += 15

  return Math.min(score, 100)
}
