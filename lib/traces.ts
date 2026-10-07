export const traceTargets: Record<string, string> = {
  convolution: 'lenet',
  vision: 'alexnet',
  learning: 'backpropagation',
  attention: 'transformers',
  memory: 'hopfield',
  'reinforcement-learning': 'dqn',
  prediction: 'predictive-coding',
  neuroai: 'neuroai',
};

export function extendTrail(
  trail: string[],
  next: string,
  edges: { source: string; target: string }[],
) {
  const index = trail.indexOf(next);
  if (index >= 0) return trail.slice(0, index + 1);
  const last = trail.at(-1);
  if (
    !last ||
    !edges.some(
      (e) => (e.source === last && e.target === next) || (e.target === last && e.source === next),
    )
  )
    return [next];
  return [...trail, next];
}
