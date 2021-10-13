import { runInAction, observable } from "mobx";
import { TerrainType } from "../types/aquarium-types";

type IndexesByHeight = {[key: number]: number[]};

interface AquariumStoreOptions {
  initialRelief: number[];
}

interface AquariumObservable {
  waterCount: number;
  configurationIsValid: boolean;
  waterSandArray: number[][];
}

export class AquariumStore {
  private relief: number[] = [];
  private reliefHeight: number | null = null;
  private ob: AquariumObservable = observable({
    waterCount: 0,
    configurationIsValid: false,
    waterSandArray: [],
  });

  constructor(options: AquariumStoreOptions) {
    this.setRelief(`[${options.initialRelief.toString()}]`);
  }

  getRelief(): number[] {
    return this.relief;
  }

  getWidth(): number {
    return this.relief.length;
  }

  getHeight(): number {
    if (this.reliefHeight === null) {
      this.reliefHeight = Math.max(...this.relief);
    }
    return this.reliefHeight;
  }

  setRelief(relief: string): void {
    const inputIsValid = /^\[ *(\d+( *, *\d+)*) *\]$/.test(relief);
    runInAction(() => {
      this.ob.configurationIsValid = inputIsValid;
    });
    if (!inputIsValid) {
      return;
    }
    const newRelief = relief.match(/\d+/g);
    if (newRelief === null) {
      return;
    }
    this.relief = newRelief.map((digits) => parseInt(digits));
    this.reliefHeight = null;

    this.makewaterSandArray();
  }

  makeIndexesByHeight(): IndexesByHeight {
    const indexesByHeight: IndexesByHeight = {};
    this.relief.forEach((value, index) => {
      if (indexesByHeight[value] === undefined) {
        indexesByHeight[value] = [];
      }
      indexesByHeight[value].push(index);
    });
    return indexesByHeight;
  }

  sortNumerically(array: any[]) {
    array.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      return (a < b) ? -1 : 0;
    });
  }

  makeSortedHeightsList(indexesByHeight: IndexesByHeight): number[] {
    let heightsList = Object.keys(indexesByHeight).map((key) => parseInt(key));
    this.sortNumerically(heightsList)
    heightsList = heightsList.reverse();
    return heightsList;
  }

  makewaterSandArray(): void {
    let terrainArray: number[][] = Array(this.relief.length).fill(null);
    const indexesByHeight = this.makeIndexesByHeight();
    const heightsList = this.makeSortedHeightsList(indexesByHeight);
    let overallWater = 0;

    let peaksToMix: number[] = [];

    // find matching peaks
    for (let i = 0; i < heightsList.length; i++) {
      const height = heightsList[i];
      if (!height) {
        indexesByHeight[0].forEach((index) => {
          if (terrainArray[index] === null) {
            terrainArray[index] = [0, 0];
          }
        });
        break;
      }

      let heightIndexes = indexesByHeight[height];
      if (peaksToMix.length) {
        heightIndexes = heightIndexes.concat(peaksToMix);
      }

      // if no peaks matched, search for lower peaks
      if (heightIndexes.length < 2 && height > 1) {
        peaksToMix = heightIndexes;

        if (terrainArray[heightIndexes[0]] === null) {
          terrainArray[heightIndexes[0]] = [0, height];
        }
        continue;
      }

      this.sortNumerically(heightIndexes);
      const lastHeightIndex = heightIndexes[heightIndexes.length - 1];

      for (let x = heightIndexes[0]; x <= lastHeightIndex; x++) {
        if (terrainArray[x] !== null) {
          continue;
        }
        const currentWater = height - this.relief[x];
        overallWater += currentWater;

        terrainArray[x] = [
          currentWater,
          this.relief[x]
        ];
      }

      // if we matched higher peaks with lower ones, we should also check only lower peaks
      if (peaksToMix.length) {
        peaksToMix = [];
        i--;
      } else {
        peaksToMix = [heightIndexes[0]];
      }
    }

    runInAction(() => {
      this.ob.waterCount = overallWater;
      this.ob.waterSandArray = terrainArray;
    });
  }

  getWaterSandArray() {
    return this.ob.waterSandArray;
  }

  getWaterCount(): number {
    return this.ob.waterCount;
  }

  getConfigurationIsValid(): boolean {
    return this.ob.configurationIsValid;
  }
}