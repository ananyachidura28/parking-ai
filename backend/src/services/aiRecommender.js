/**
 * AI Slot Recommender Algorithm for ParkSmart AI
 * Evaluates vehicle type (EV vs ICE), accessibility needs, distance to lift,
 * pricing, and user history to rank available slots.
 */
function recommendBestSlot(availableSlots, preferences = {}) {
  if (!availableSlots || availableSlots.length === 0) return null;

  const { isEV = false, requiresDisabledAccess = false, preferVIP = false } = preferences;

  const scoredSlots = availableSlots.map((slot) => {
    let score = 100;

    // Distance to lift penalty
    score -= slot.distanceToLift * 1.5;

    // EV matching
    if (isEV) {
      if (slot.isEVCharger || slot.type === 'EV_CHARGING') {
        score += 80;
        if (slot.chargerKw && slot.chargerKw >= 100) score += 30; // Fast charger bonus
      } else {
        score -= 40;
      }
    }

    // Accessible matching
    if (requiresDisabledAccess) {
      if (slot.type === 'ACCESSIBLE') {
        score += 100;
      } else {
        score -= 50;
      }
    }

    // VIP matching
    if (preferVIP && slot.type === 'VIP') {
      score += 50;
    }

    // Floor proximity bonus
    if (slot.floor && slot.floor.level === -1) {
      score += 20; // Lower level basement preferred
    }

    return { slot, score };
  });

  scoredSlots.sort((a, b) => b.score - a.score);
  return scoredSlots[0] ? scoredSlots[0].slot : availableSlots[0];
}

module.exports = { recommendBestSlot };
