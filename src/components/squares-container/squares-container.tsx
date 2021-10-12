import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import { AquariumContext } from '../aquarium/aquarium';
import { Square } from '../square/square';
import { TerrainType } from '../../types/aquarium-types';
import './squares-container.scss';

export const SquaresContainer = observer(() => {
  const aquariumStore = useContext(AquariumContext);

  const aquariumMap = aquariumStore.getAquariumMap();
  let squares = [];
  const height = aquariumStore.getHeight();
  const width = aquariumStore.getWidth();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      squares.push(<Square key={nanoid()} terrainType={aquariumMap[x][y]} />);
    }
  }
  for (let x = 0; x < width; x++) {
    squares.push(
      <Square
        terrainType={TerrainType.BASE}
        key={nanoid()}
      />
    );
  }

  return (
    <div className="squares-container">
      <div
        className="squares-wrapper"
        style={{ width: aquariumStore.getPxSize(aquariumStore.getWidth()) }}
      >{squares}</div>
    </div>
  );
});