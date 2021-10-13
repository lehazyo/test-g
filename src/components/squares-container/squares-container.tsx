import React, { useContext, useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { AquariumContext } from '../aquarium/aquarium';
import { SquaresGraph } from '../squares-graph/squares-graph';
import './squares-container.scss';

export const SquaresContainer = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const minCellSize = 2;
  const maxCellSize = 30;
  const borderWidth = 1;

  const [cellSize, setCellSize] = useState(maxCellSize);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  const aquariumStore = useContext(AquariumContext);
  const waterSandArray = aquariumStore.getWaterSandArray();

  useEffect(() => {
    const resizeDimensions = () => {
      if (containerRef.current !== null) {
        const possibleCellX = Math.floor((containerRef.current.clientWidth - 20) / aquariumStore.getWidth());
        const possibleCellY = Math.floor((containerRef.current.clientHeight - 20) / (aquariumStore.getHeight() + 1));
        let cellSize = Math.min(possibleCellX, possibleCellY);
        cellSize -= borderWidth;

        if (cellSize < minCellSize) {
          cellSize = minCellSize;
        }
        if (cellSize > maxCellSize) {
          cellSize = maxCellSize;
        }
        setCellSize(cellSize);
        setWrapperWidth(aquariumStore.getWidth() * cellSize + aquariumStore.getWidth() * borderWidth + borderWidth);
        setWrapperHeight((aquariumStore.getHeight() + 1) * cellSize + (aquariumStore.getHeight() + 1) * borderWidth + borderWidth);
      }
    }

    resizeDimensions();

    window.addEventListener("resize", resizeDimensions);

    return () => window.removeEventListener("resize", resizeDimensions);
    // @ts-ignore exhaustive-deps
  }, [waterSandArray]);

  return (
    <div ref={containerRef} className="squares-container">
      <SquaresGraph
        widthPx={wrapperWidth}
        heightPx={wrapperHeight}
        height={aquariumStore.getHeight()}
        cellSize={cellSize}
        waterSandArray={waterSandArray}
      />
    </div>
  );
});