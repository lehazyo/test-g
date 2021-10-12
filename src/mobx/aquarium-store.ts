import { runInAction, observable } from "mobx";
import { TerrainType } from "../types/aquarium-types";

type IndexesByHeight = {[key: number]: number[]};

interface AquariumStoreOptions {
  initialRelief: number[];
}

interface AquariumObservable {
  aquariumMap: {[key: number]: TerrainType[]};
  waterCount: number;
}

export class AquariumStore {
  private relief: number[] = [];
  private reliefHeight: number | null = null;
  private ob: AquariumObservable = observable({
    aquariumMap: {},
    waterCount: 0,
  });

  readonly squareSize: number = 30;
  readonly borderWidth: number = 1;

  constructor(options: AquariumStoreOptions) {
    this.relief = options.initialRelief;
    this.refreshMap();
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

  getPxSize(size: number): number {
    return size * this.squareSize - ((size - 1) * this.borderWidth);
  }

  getTerrainTypeByCoords(x: number, y: number): TerrainType {
    const xBlock = this.ob.aquariumMap[x];
    if (xBlock === undefined) {
      return TerrainType.AIR;
    }
    const yBlock = xBlock[y];
    if (yBlock === undefined) {
      return TerrainType.AIR;
    }
    return yBlock;
  }

  setRelief(relief: string): void {
    const inputIsValid = /^\[ *(\d+( *, *\d+)*) *\]$/.test(relief);
    if (!inputIsValid) {
      return;
    }
    const newRelief = relief.match(/\d+/g);
    if (newRelief === null) {
      return;
    }
    this.relief = newRelief.map((digits) => parseInt(digits));
    this.reliefHeight = null;

    this.refreshMap();
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

  makeSandWaterArray(): number[][] {
    let terrainArray: number[][] = Array(this.relief.length).fill(null);
    const indexesByHeight = this.makeIndexesByHeight();
    const heightsList = this.makeSortedHeightsList(indexesByHeight);

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

        terrainArray[heightIndexes[0]] = [0, height];
        continue;
      }

      this.sortNumerically(heightIndexes);
      const lastHeightIndex = heightIndexes[heightIndexes.length - 1];

      for (let x = heightIndexes[0]; x <= lastHeightIndex; x++) {
        if (terrainArray[x] !== null) {
          continue;
        }
        terrainArray[x] = [
          height - this.relief[x],
          this.relief[x]
        ];
      }

      // if we matched higher peaks with lower ones, we should also check only lower peaks
      if (peaksToMix.length) {
        peaksToMix = [];
        i--;
      }
    }

    return terrainArray;
  }

  refreshMap() {
    this.ob.waterCount = 0;
    runInAction(() => {
      this.ob.aquariumMap = this.makeSandWaterArray().map(([ waterWidth, sandWidth ]) => {
        const terrainArray = [];
        const airWidth = this.getHeight() - sandWidth - waterWidth;
        if (airWidth) {
          terrainArray.push(...Array(airWidth).fill(TerrainType.AIR));
        }
        if (waterWidth) {
          this.ob.waterCount += waterWidth;
          terrainArray.push(...Array(waterWidth).fill(TerrainType.WATER));
        }
        if (sandWidth) {
          terrainArray.push(...Array(sandWidth).fill(TerrainType.SAND));
        }
        return terrainArray;
      });
    });
  }

  getWaterCount() {
    return this.ob.waterCount;
  }

  getAquariumMap() {
    return this.ob.aquariumMap;
  }
}