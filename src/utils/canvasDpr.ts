/**
 * Retina & HiDPI Device Pixel Ratio Canvas Utilities
 * Ensures razor-sharp vector/geometric rendering across all Apple Retina and standard displays.
 */

export interface CanvasDimensions {
  width: number;
  height: number;
  dpr: number;
}

/**
 * Configures an HTML5 Canvas for HiDPI / Retina displays.
 * Sets internal bitmap width/height scaled by DPR while preserving CSS display size.
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasDimensions {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const ctx = canvas.getContext('2d');

  // Set display size (CSS pixels)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Set internal buffer size (scaled for DPR)
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  if (ctx) {
    // Normalize coordinate system so draw calls use CSS pixel coordinates
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return { width, height, dpr };
}

/**
 * Coordinate mapping from Data Space [minX, maxX] to Screen Pixels [padding, width - padding]
 */
export function mapDataToScreen(
  val: number,
  dataMin: number,
  dataMax: number,
  screenMin: number,
  screenMax: number
): number {
  if (dataMax === dataMin) return screenMin;
  const normalized = (val - dataMin) / (dataMax - dataMin);
  return screenMin + normalized * (screenMax - screenMin);
}

/**
 * Inverted Y-axis coordinate mapping (Cartesian to Canvas screen space)
 */
export function mapCartesianYToScreen(
  y: number,
  yMin: number,
  yMax: number,
  height: number,
  paddingTop = 20,
  paddingBottom = 30
): number {
  const usableHeight = height - paddingTop - paddingBottom;
  if (yMax === yMin) return height - paddingBottom;
  const normalized = (y - yMin) / (yMax - yMin);
  return height - paddingBottom - normalized * usableHeight;
}
