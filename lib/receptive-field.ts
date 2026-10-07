/** Unit stride and dilation, no pooling: each layer adds kernel - 1 cells. */
export function receptiveWidth(layers: number, kernel: number) {
  return 1 + layers * (kernel - 1);
}
export function projectField(x: number, y: number, layer: number, angle: number) {
  const a = (angle * Math.PI) / 180;
  return {
    x: 300 + (x * Math.cos(a) - y * Math.sin(a)) * 15,
    y: 325 + (x * Math.sin(a) + y * Math.cos(a)) * 6 - layer * 60,
  };
}
