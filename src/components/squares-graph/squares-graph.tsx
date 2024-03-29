import React, { FC, useEffect, useRef } from 'react';

export interface SquaresGraphProps {
  height: number;
  widthPx: number;
  heightPx: number;
  cellSize: number;
  waterCubesArray: number[][];
}

export const SquaresGraph: FC<SquaresGraphProps> = ({
  height,
  widthPx,
  heightPx,
  cellSize,
  waterCubesArray,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    const redrawCanvas = () => {
      if (canvasRef.current !== null) {
        const context = canvasRef.current.getContext("2d");
        if (context !== null) {
          const colors = {
            "base": "#666",
            "border": "#999",
            "air": "#fff",
            "cube": "#fd7",
            "water": "#aaf",
          }
          const borderWidth = 1;

          context.clearRect(0, 0, widthPx, heightPx);

          context.fillStyle = colors.border;
          context.fillRect(0, 0, widthPx, heightPx);

          waterCubesArray.forEach((xArray, xIndex) => {

            const waterCount = xArray[0];
            const cubesCount = xArray[1];
            const airCount = height - waterCount - cubesCount;

            let currentTerrainType: 'air' | 'water' | 'cube';
            for (let y = 0; y < height; y++) {
              if (y + 1 > airCount + waterCount) {
                currentTerrainType = 'cube';
              } else {
                currentTerrainType = (y + 1 > airCount)
                  ? 'water'
                  : 'air';
              }

              context.fillStyle = colors[currentTerrainType];
              context.fillRect(
                borderWidth + xIndex * (borderWidth + cellSize),
                borderWidth + y * (borderWidth + cellSize),
                cellSize,
                cellSize,
              );
            }

            context.fillStyle = colors.base;
            context.fillRect(
              borderWidth + xIndex * (borderWidth + cellSize),
              borderWidth + height * (borderWidth + cellSize),
              cellSize,
              cellSize,
            );
          });
        }
      }
    }

    redrawCanvas();

    window.addEventListener("resize", redrawCanvas);

    return () => window.removeEventListener("resize", redrawCanvas);
  }, [cellSize, height, widthPx, heightPx, waterCubesArray]);

  return (
    <canvas className="squares-graph" width={widthPx} height={heightPx} ref={canvasRef}></canvas>
  );
}