export function renderAxis(this: unknown, ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = "rgba(93, 173, 226)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 0.8 * size);
  ctx.lineTo(-0.2 * size, 0.8 * size);
  ctx.lineTo(0, size);
  ctx.lineTo(+0.2 * size, 0.8 * size);
  ctx.lineTo(0, 0.8 * size);
  ctx.stroke();

  ctx.strokeStyle = "rgba(236, 112, 99)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0.8 * size, 0);
  ctx.lineTo(0.8 * size, -0.2 * size);
  ctx.lineTo(size, 0);
  ctx.lineTo(0.8 * size, +0.2 * size);
  ctx.lineTo(0.8 * size, 0);
  ctx.stroke();
}

export function renderPoint(this: unknown, ctx: CanvasRenderingContext2D, px: number, py: number) {
  ctx.beginPath();
  ctx.beginPath();
  ctx.moveTo(px - 0.2, py - 0.2);
  ctx.lineTo(px + 0.2, py + 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px - 0.2, py + 0.2);
  ctx.lineTo(px + 0.2, py - 0.2);
  ctx.stroke();
}
