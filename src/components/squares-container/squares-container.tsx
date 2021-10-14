import React, { useContext, useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { AquariumContext } from '../aquarium/aquarium';
import { SquaresGraph } from '../squares-graph/squares-graph';
import './squares-container.scss';
import { canvasSizeCalc } from '../utils/canvas-size-calc';

export const SquaresContainer = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [cellSize, setCellSize] = useState(0);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  const aquariumStore = useContext(AquariumContext);
  const waterCubesArray = aquariumStore.getWaterCubesArray();

  useEffect(() => {
    const resizeDimensions = () => {
      if (containerRef.current !== null) {
        const [ cellSize, canvasWidth, canvasHeight ] = canvasSizeCalc(
          aquariumStore.getWidth(),
          aquariumStore.getHeight(),
          containerRef.current.clientWidth,
          containerRef.current.clientHeight,
        );

        setCellSize(cellSize);
        setWrapperWidth(canvasWidth);
        setWrapperHeight(canvasHeight);
      }
    }

    resizeDimensions();

    window.addEventListener("resize", resizeDimensions);

    return () => window.removeEventListener("resize", resizeDimensions);
    // eslint-disable-next-line
  }, [waterCubesArray]);

  return (
    <div ref={containerRef} className="squares-container">
      <SquaresGraph
        widthPx={wrapperWidth}
        heightPx={wrapperHeight}
        height={aquariumStore.getHeight()}
        cellSize={cellSize}
        waterCubesArray={waterCubesArray}
      />
    </div>
  );
});