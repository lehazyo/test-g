import React, { createContext } from 'react';
import { AquariumStore } from '../../mobx/aquarium-store';
import { ReliefInput } from '../relief-input/relief-input';
import { SquaresContainer } from '../squares-container/squares-container';
import '../../_common.scss';
import './aquarium.scss';

// const initialRelief = [4, 2, 3, 2, 5, 0, 1, 3];
// const initialRelief = [18,29,22,46,42,33,30,49,3,18,20,13,7,19,35,23,29,45,36,1,4,36,11,16,4,47,39,26,12,4,2,36,13,0,17,29,15,24,38,4,20,28,15,43,14,42,45,50,31,47,33,46,6,32,47,25,33,9,39,35,0,41,24,34];
// const initialRelief = [18,29,22,29,12];
// const initialRelief = [4,0,4,0,5,0,3];
const initialRelief = [4,0,4,0,5,0,0,0,0,0,0,0,0,0,0,0,3];

const aquariumStore = new AquariumStore({
  initialRelief,
});

export const AquariumContext = createContext(aquariumStore);

export const Aquarium = () => {
  return (
    <AquariumContext.Provider value={aquariumStore}>
      <div className="aquarium-wrapper">
        <ReliefInput initialRelief={initialRelief} />
        <SquaresContainer />
      </div>
    </AquariumContext.Provider>
  )
};