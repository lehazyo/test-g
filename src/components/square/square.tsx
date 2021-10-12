import React, { FC } from 'react';
import { TerrainType } from '../../types/aquarium-types';
import './square.scss';

export interface SquareProps {
  terrainType?: TerrainType;
}

export const Square: FC<SquareProps> = ({ terrainType }) =>
  <div className={`aquarium-square type-${terrainType}`}></div>;