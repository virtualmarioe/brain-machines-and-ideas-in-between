type Point = { x: number; y: number };

/** Separate nearby markers while retaining each research site's true anchor. */
export function separateMapPins(points: readonly Point[], minimumDistance: number): Point[] {
  const placed: Point[] = [];
  for (const point of points) {
    let candidate = point;
    let step = 0;
    while (
      placed.some(
        (other) => Math.hypot(candidate.x - other.x, candidate.y - other.y) < minimumDistance,
      )
    ) {
      step += 1;
      const radius = Math.sqrt(step) * minimumDistance * 0.55;
      const angle = step * Math.PI * (3 - Math.sqrt(5));
      candidate = { x: point.x + Math.cos(angle) * radius, y: point.y + Math.sin(angle) * radius };
    }
    // Avoid sub-pixel transcendental differences between server and browser engines.
    placed.push({ x: Number(candidate.x.toFixed(6)), y: Number(candidate.y.toFixed(6)) });
  }
  return placed;
}
