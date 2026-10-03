export interface Point {
  x: number;
  y: number;
}

/** A threshold unit: the non-negative half-plane belongs to class 1. */
export function perceptron(x1: number, x2: number, w1: number, w2: number, bias: number) {
  const activation = w1 * x1 + w2 * x2 + bias;
  return { activation, prediction: activation >= 0 ? 1 : 0 };
}

/** Clip w1*x + w2*y + bias = 0 to a square, including vertical boundaries. */
export function decisionBoundary(w1: number, w2: number, bias: number, extent = 1): Point[] {
  const candidates: Point[] = [];
  const add = (x: number, y: number) => {
    if (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Math.abs(x) <= extent + 1e-9 &&
      Math.abs(y) <= extent + 1e-9 &&
      !candidates.some((p) => Math.hypot(p.x - x, p.y - y) < 1e-9)
    )
      candidates.push({ x, y });
  };
  if (Math.abs(w2) > 1e-12) {
    add(-extent, (-bias + w1 * extent) / w2);
    add(extent, (-bias - w1 * extent) / w2);
  }
  if (Math.abs(w1) > 1e-12) {
    add((-bias + w2 * extent) / w1, -extent);
    add((-bias - w2 * extent) / w1, extent);
  }
  return candidates.slice(0, 2);
}

export type Matrix = number[][];
export type FilterKind = 'horizontal' | 'vertical' | 'diagonal';

/** Zero-sum, hand-designed line detectors, with unit positive mass. */
export const lineFilters: Record<FilterKind, Matrix> = {
  horizontal: [
    [-1 / 6, -1 / 6, -1 / 6],
    [1 / 3, 1 / 3, 1 / 3],
    [-1 / 6, -1 / 6, -1 / 6],
  ],
  vertical: [
    [-1 / 6, 1 / 3, -1 / 6],
    [-1 / 6, 1 / 3, -1 / 6],
    [-1 / 6, 1 / 3, -1 / 6],
  ],
  diagonal: [
    [-1 / 6, -1 / 6, 1 / 3],
    [-1 / 6, 1 / 3, -1 / 6],
    [1 / 3, -1 / 6, -1 / 6],
  ],
};

/** A soft bright line. Zero degrees is horizontal; positive angles tilt upward. */
export function lineStimulus(angleDegrees: number, size = 7): Matrix {
  if (!Number.isInteger(size) || size < 3)
    throw new Error('Stimulus size must be an integer of at least 3.');
  const theta = (angleDegrees * Math.PI) / 180;
  const center = (size - 1) / 2;
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const distance = (col - center) * Math.sin(theta) + (row - center) * Math.cos(theta);
      return Math.exp(-0.5 * (distance / 0.55) ** 2);
    }),
  );
}

/** Valid cross-correlation, the operation conventionally named convolution in CNNs. */
export function correlateValid(input: Matrix, kernel: Matrix): Matrix {
  const width = input[0]?.length ?? 0;
  const kernelWidth = kernel[0]?.length ?? 0;
  if (
    !width ||
    !kernelWidth ||
    input.some((row) => row.length !== width) ||
    kernel.some((row) => row.length !== kernelWidth) ||
    kernel.length > input.length ||
    kernelWidth > width
  )
    throw new Error('Input and kernel must be rectangular and the kernel must fit.');
  return Array.from({ length: input.length - kernel.length + 1 }, (_, row) =>
    Array.from({ length: width - kernelWidth + 1 }, (_, col) =>
      kernel.reduce(
        (sum, kernelRow, kr) =>
          sum +
          kernelRow.reduce(
            (partial, weight, kc) => partial + weight * input[row + kr][col + kc],
            0,
          ),
        0,
      ),
    ),
  );
}

export interface NetworkState {
  input: number;
  target: number;
  w1: number;
  w2: number;
}

/** One hidden tanh unit and a linear output, with squared-error loss. */
export function forwardAndBackward({ input, target, w1, w2 }: NetworkState) {
  const hidden = Math.tanh(w1 * input);
  const prediction = w2 * hidden;
  const error = prediction - target;
  const loss = 0.5 * error ** 2;
  const gradW2 = error * hidden;
  const gradW1 = error * w2 * (1 - hidden ** 2) * input;
  return { hidden, prediction, error, loss, gradW1, gradW2 };
}

/** Backtracking keeps this educational control's finite steps from increasing loss. */
export function trainStep(state: NetworkState, learningRate: number) {
  if (!Number.isFinite(learningRate) || learningRate <= 0)
    throw new Error('Learning rate must be positive and finite.');
  const before = forwardAndBackward(state);
  let effectiveRate = learningRate;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const next = {
      ...state,
      w1: state.w1 - effectiveRate * before.gradW1,
      w2: state.w2 - effectiveRate * before.gradW2,
    };
    const after = forwardAndBackward(next);
    if (after.loss <= before.loss) return { state: next, before, after, effectiveRate };
    effectiveRate /= 2;
  }
  return { state, before, after: before, effectiveRate: 0 };
}
