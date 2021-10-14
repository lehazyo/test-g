import { canvasSizeCalc } from '../canvas-size-calc';

describe("CanvasSizeCalc tests", () => {
  test.each([
    [1, 1, 100, 100, 30, 32, 63],
    [3, 1, 100, 100, 25, 79, 53],
    [3, 3, 100, 100, 19, 61, 81],
    [7, 21, 100, 100, 2, 22, 67],
    [1, 1, 500, 500, 30, 32, 63],
    [8, 9, 500, 500, 30, 249, 311],
    [40, 38, 500, 500, 11, 481, 469],
    [1, 1, 2000, 2000, 30, 32, 63],
    [6, 78, 2000, 2000, 24, 151, 1976],
    [40, 38, 2000, 2000, 30, 1241, 1210],
    [100, 100, 2000, 2000, 18, 1901, 1920],
  ])("For arguments %s,%s,%s,%s canvasSizeCalc returns array %s,%s,%s", (
    xSize,
    ySize,
    parentWidthPx,
    parentHeightPx,
    cellSize,
    canvasWidth,
    canvasHeight,
  ) => {
    expect(canvasSizeCalc(
      xSize,
      ySize,
      parentWidthPx,
      parentHeightPx
    )).toStrictEqual([cellSize, canvasWidth, canvasHeight]);
  });
});