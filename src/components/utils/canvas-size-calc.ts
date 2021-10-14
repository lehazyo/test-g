export const canvasSizeCalc = (
  xSize: number,
  ySize: number,
  parentWidthPx: number,
  parentHeightPx: number
) => {  
  const minCellSize = 2;
  const maxCellSize = 30;
  const borderWidth = 1;

  const possibleCellX = Math.floor((parentWidthPx - 20) / xSize);
  const possibleCellY = Math.floor((parentHeightPx - 20) / (ySize + 1));
  let cellSize = Math.min(possibleCellX, possibleCellY);
  cellSize -= borderWidth;

  if (cellSize < minCellSize) {
    cellSize = minCellSize;
  }
  if (cellSize > maxCellSize) {
    cellSize = maxCellSize;
  }

  const canvasWidth = xSize * cellSize + xSize * borderWidth + borderWidth;
  const canvasHeight = (ySize + 1) * cellSize + (ySize + 1) * borderWidth + borderWidth;

  return [
    cellSize,
    canvasWidth,
    canvasHeight,
  ];
};
