export interface ReliabilityFactor {
  confirmedCount: number;
  checkInCount: number;
  cancellationCount: number;
  noShowCount: number;
}

export class ReliabilityService {
  /**
   * Calculates ⭐ Meetup Reliability Score percentage (0% to 100%)
   */
  public static calculateScore(factors: ReliabilityFactor): number {
    const totalEvents = factors.confirmedCount + factors.noShowCount;
    if (totalEvents === 0) return 95.0; // Default fresh score

    const checkInWeight = 1.0;
    const cancellationWeight = 0.8; // Minor penalty if canceled early
    const noShowWeight = 0.0;       // Severe penalty for no-shows

    const weightedSuccess =
      (factors.checkInCount * checkInWeight) +
      (factors.cancellationCount * cancellationWeight) +
      (factors.noShowCount * noShowWeight);

    const score = (weightedSuccess / totalEvents) * 100;
    return Math.min(Math.max(Math.round(score), 40), 99);
  }
}
