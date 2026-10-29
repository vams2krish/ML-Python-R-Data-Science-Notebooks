// Fixed pseudo-random noise makes slider comparisons reproducible.
export function generateData(slope = 2, noise = 1.5, count = 30) {
  if (!Number.isFinite(slope) || !Number.isFinite(noise) || noise < 0 || !Number.isInteger(count) || count < 2) throw new RangeError('Invalid experiment parameters');
  let seed = 42;
  return Array.from({length: count}, (_, i) => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    const x = i * 10 / (count - 1);
    return {x, y: slope * x + 1 + (seed / 4294967296 - 0.5) * noise * 2};
  });
}
export function fitLine(points) {
  if (points.length < 2 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw new RangeError('At least two finite points required');
  const n = points.length;
  const mx = points.reduce((a,p) => a + p.x, 0) / n;
  const my = points.reduce((a,p) => a + p.y, 0) / n;
  const variance = points.reduce((a,p) => a + (p.x-mx)**2, 0);
  if (!variance) throw new RangeError('x must vary');
  const slope = points.reduce((a,p) => a + (p.x-mx)*(p.y-my), 0) / variance;
  const intercept = my - slope * mx;
  const sse = points.reduce((a,p) => a + (p.y - (slope*p.x+intercept))**2, 0);
  const sst = points.reduce((a,p) => a + (p.y-my)**2, 0);
  return {slope, intercept, rmse: Math.sqrt(sse/n), r2: sst < 1e-20 ? null : 1-sse/sst};
}
export function toCSV(points) { return 'x,y\n' + points.map(p => `${p.x},${p.y}`).join('\n') + '\n'; }
