const MAX_STEPS_PER_MINUTE = 260;
const MAX_MILES_PER_HOUR = 8;
const MAX_SESSION_HOURS = 6;

const MIN_REALISTIC_STEP_INTERVAL = 250;

export function validateWalkSession(session = {}) {
  const {
    steps = 0,
    miles = 0,
    durationSeconds = 0,
    stepTimestamps = [],
    gpsDistanceMiles = null,
  } = session;

  const issues = [];

  // =========================================
  // BASIC VALIDATION
  // =========================================

  if (steps <= 0) {
    issues.push("No steps recorded.");
  }

  if (durationSeconds <= 0) {
    issues.push("Invalid session duration.");
  }

  // =========================================
  // STEP RATE VALIDATION
  // =========================================

  const durationMinutes = durationSeconds / 60;

  if (durationMinutes > 0) {
    const stepsPerMinute = steps / durationMinutes;

    if (stepsPerMinute > MAX_STEPS_PER_MINUTE) {
      issues.push(
        `Unrealistic step rate detected (${Math.round(
          stepsPerMinute
        )} spm).`
      );
    }
  }

  // =========================================
  // SPEED VALIDATION
  // =========================================

  const durationHours = durationSeconds / 3600;

  if (durationHours > 0) {
    const mph = miles / durationHours;

    if (mph > MAX_MILES_PER_HOUR) {
      issues.push(
        `Walking speed too high (${mph.toFixed(1)} mph).`
      );
    }
  }

  // =========================================
  // MAX SESSION LIMIT
  // =========================================

  if (durationHours > MAX_SESSION_HOURS) {
    issues.push("Session exceeded max allowed duration.");
  }

  // =========================================
  // RAPID STEP DETECTION
  // =========================================

  if (stepTimestamps.length > 2) {
    let suspiciousBursts = 0;

    for (let i = 1; i < stepTimestamps.length; i++) {
      const delta =
        stepTimestamps[i] - stepTimestamps[i - 1];

      if (delta < MIN_REALISTIC_STEP_INTERVAL) {
        suspiciousBursts++;
      }
    }

    if (suspiciousBursts > 30) {
      issues.push(
        "Suspicious rapid step activity detected."
      );
    }
  }

  // =========================================
  // GPS VS STEP COMPARISON
  // =========================================

  if (
    gpsDistanceMiles !== null &&
    Math.abs(gpsDistanceMiles - miles) > 2
  ) {
    issues.push(
      "GPS distance does not match recorded walking distance."
    );
  }

  // =========================================
  // FINAL RESULT
  // =========================================

  return {
    valid: issues.length === 0,
    issues,
    riskScore: calculateRiskScore(issues),
  };
}

function calculateRiskScore(issues = []) {
  if (issues.length === 0) return 0;

  let score = 0;

  issues.forEach((issue) => {
    if (issue.includes("Unrealistic")) score += 30;
    else if (issue.includes("speed")) score += 25;
    else if (issue.includes("rapid")) score += 40;
    else if (issue.includes("GPS")) score += 35;
    else score += 15;
  });

  return Math.min(score, 100);
}

export function shouldBlockReward(validation = {}) {
  return (
    !validation.valid ||
    validation.riskScore >= 50
  );
}

export function createFraudReport(session, validation) {
  return {
    timestamp: new Date().toISOString(),
    session,
    validation,
    recommendedAction:
      validation.riskScore >= 75
        ? "BLOCK_REWARDS"
        : validation.riskScore >= 40
        ? "MANUAL_REVIEW"
        : "ALLOW",
  };
}