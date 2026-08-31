export interface MatchResult {
  matchPercentage: number;
  breakdown: {
    interestScore: number;
    activityScore: number;
    personalityScore: number;
    distanceScore: number;
  };
  matchingReasons: string[];
}

export function calculateVibeMatch(userA: any, userB: any): MatchResult {
  const reasons: string[] = [];

  // 1. Interest Overlap (Max 35 pts)
  let interestsA: string[] = [];
  let interestsB: string[] = [];
  try {
    interestsA = typeof userA.interests === 'string' ? JSON.parse(userA.interests || '[]') : (userA.interests || []);
    interestsB = typeof userB.interests === 'string' ? JSON.parse(userB.interests || '[]') : (userB.interests || []);
  } catch (e) {
    interestsA = [];
    interestsB = [];
  }

  const sharedInterests = interestsA.filter((item: string) =>
    interestsB.some((b: string) => b.toLowerCase() === item.toLowerCase())
  );

  let interestScore = 0;
  if (interestsA.length > 0 || interestsB.length > 0) {
    const unionSize = new Set([...interestsA, ...interestsB]).size;
    const ratio = unionSize > 0 ? sharedInterests.length / unionSize : 0;
    interestScore = Math.round(ratio * 35 * 1.8);
    if (interestScore > 35) interestScore = 35;
  }
  if (sharedInterests.length > 0) {
    reasons.push(`Shared interests in ${sharedInterests.slice(0, 3).join(', ')}`);
  }

  // 2. Activity & Hobbies Overlap (Max 25 pts)
  let activitiesA: string[] = [];
  let activitiesB: string[] = [];
  try {
    activitiesA = typeof userA.activities === 'string' ? JSON.parse(userA.activities || '[]') : (userA.activities || []);
    activitiesB = typeof userB.activities === 'string' ? JSON.parse(userB.activities || '[]') : (userB.activities || []);
  } catch (e) {
    activitiesA = [];
    activitiesB = [];
  }

  const sharedActivities = activitiesA.filter((act: string) =>
    activitiesB.some((b: string) => b.toLowerCase() === act.toLowerCase())
  );

  let activityScore = 0;
  if (activitiesA.length > 0 || activitiesB.length > 0) {
    activityScore = Math.min(25, sharedActivities.length * 8.5 + (sharedActivities.length > 0 ? 8 : 0));
  } else {
    activityScore = 15;
  }
  if (sharedActivities.length > 0) {
    reasons.push(`Both enjoy ${sharedActivities.slice(0, 2).join(' & ')}`);
  }

  // 3. Personality & Vibe Compatibility (Max 20 pts)
  let personalityScore = 12;
  if (userA.personalityType === userB.personalityType) {
    personalityScore += 8;
    reasons.push(`Matching ${userA.personalityType || 'Ambivert'} energy style`);
  } else if (
    (userA.personalityType === 'Introvert' && userB.personalityType === 'Ambivert') ||
    (userA.personalityType === 'Extrovert' && userB.personalityType === 'Ambivert')
  ) {
    personalityScore += 5;
    reasons.push('Complementary intro/extrovert balance');
  }

  if (userA.socialIntentions && userB.socialIntentions && userA.socialIntentions === userB.socialIntentions) {
    reasons.push(`Same social goal: ${userA.socialIntentions}`);
  }

  // 4. Distance Score (Max 20 pts)
  let distanceScore = 20;
  let distanceKm = 3.5;

  if (userA.lat && userA.lng && userB.lat && userB.lng) {
    distanceKm = calculateHaversineDistance(userA.lat, userA.lng, userB.lat, userB.lng);
  } else if (userA.city && userB.city && userA.city.toLowerCase() === userB.city.toLowerCase()) {
    distanceKm = 4.0;
  } else {
    distanceKm = 25.0;
  }

  distanceScore = Math.max(0, Math.round(20 - (distanceKm * 0.4)));
  if (distanceKm <= 5) {
    reasons.push(`Very close distance (~${distanceKm.toFixed(1)} km away)`);
  } else if (userA.city && userB.city && userA.city.toLowerCase() === userB.city.toLowerCase()) {
    reasons.push(`Based in the same city (${userA.city})`);
  }

  const totalMatch = Math.min(99, Math.max(50, interestScore + activityScore + personalityScore + distanceScore));

  if (reasons.length === 0) {
    reasons.push('High social vibe overlap & active community participation');
  }

  return {
    matchPercentage: totalMatch,
    breakdown: {
      interestScore,
      activityScore,
      personalityScore,
      distanceScore,
    },
    matchingReasons: reasons,
  };
}

export class VibeMatcherService {
  public static calculateMatch(userA: any, userB: any) {
    return calculateVibeMatch(userA, userB);
  }
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
