import React, { createContext } from 'react';
import { AquariumStore } from '../../mobx/aquarium-store';
import { ReliefInput } from '../relief-input/relief-input';
import { SquaresContainer } from '../squares-container/squares-container';
import '../../_common.scss';
import './aquarium.scss';

// const initialRelief = [4, 2, 3, 2, 5, 0, 1, 3];
const initialRelief = [4,2,3,2,5,0,1,3,0,10,0,0,1,0,0,0];
const aquariumStore = new AquariumStore({
  initialRelief,
});

export const AquariumContext = createContext(aquariumStore);

export const Aquarium = () => {
  return (
    <AquariumContext.Provider value={aquariumStore}>
      <div className="aquarium-wrapper" >
        <ReliefInput initialRelief={initialRelief} />
        <SquaresContainer />
      </div>
    </AquariumContext.Provider>
  )
};