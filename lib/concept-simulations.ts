/** Binary source entropy in bits; deterministic outcomes carry no uncertainty. */
export function binaryEntropy(p: number): number {
  if (!Number.isFinite(p) || p < 0 || p > 1) throw new Error('Probability must lie in [0, 1].');
  return p === 0 || p === 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

export function attentionWeights(scores: number[], temperature: number): number[] {
  if (
    temperature <= 0 ||
    !Number.isFinite(temperature) ||
    scores.length === 0 ||
    scores.some((s) => !Number.isFinite(s))
  )
    throw new Error('Finite scores and a positive temperature are required.');
  const maximum = Math.max(...scores);
  const exponents = scores.map((score) => Math.exp((score - maximum) / temperature));
  const total = exponents.reduce((sum, value) => sum + value, 0);
  return exponents.map((value) => value / total);
}

export function temporalDifference(
  estimate: number,
  reward: number,
  nextValue: number,
  discount: number,
  rate: number,
) {
  const target = reward + discount * nextValue;
  const error = target - estimate;
  return { target, error, updated: estimate + rate * error };
}

export function discountedReturn(rewards: number[], discount: number) {
  return rewards.reduce((total, reward, index) => total + reward * discount ** index, 0);
}

/** One stored bipolar pattern, symmetric Hebbian weights, and no self-connections. */
export function memoryWeights(pattern: number[]): number[][] {
  return pattern.map((a, i) => pattern.map((b, j) => (i === j ? 0 : (a * b) / pattern.length)));
}

export function memoryEnergy(state: number[], weights: number[][]): number {
  return (
    -0.5 *
    state.reduce(
      (sum, value, i) => sum + value * weights[i].reduce((inner, w, j) => inner + w * state[j], 0),
      0,
    )
  );
}

/** Sequential updates ensure the usual non-increasing Hopfield energy. Ties keep state. */
export function recallSweep(state: number[], weights: number[][]): number[] {
  const next = [...state];
  for (let i = 0; i < next.length; i += 1) {
    const field = weights[i].reduce((sum, weight, j) => sum + weight * next[j], 0);
    if (field !== 0) next[i] = field > 0 ? 1 : -1;
  }
  return next;
}

export function feedbackTrajectory(gain: number, target = 1, steps = 12): number[] {
  const values = [0];
  for (let i = 0; i < steps; i += 1) values.push(values.at(-1)! + gain * (target - values.at(-1)!));
  return values;
}

export function hingeDistance(angleDegrees: number): number {
  return Math.sqrt(2 - 2 * Math.cos((angleDegrees * Math.PI) / 180));
}

/** Conductance balance with fixed open channels, including a leak conductance. */
export function membraneBalance(sodium: number, potassium: number) {
  const leak = 0.3;
  return (sodium * 50 + potassium * -77 + leak * -54.4) / (sodium + potassium + leak);
}
