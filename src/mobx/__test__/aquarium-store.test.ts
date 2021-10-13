import { AquariumStore } from '../../mobx/aquarium-store';

describe("AquariumStore tests", () => {
  test.each([
    [[0]],
    [[0, 1, 3, 2, 4]],
    [[19,8,44,15,17,33,14,29,25,16,36,7,45,14,18,2,15,36,13,27,30,47,19,18,13,21,40,25,31,2,13,36,47,13,26,18,50,48,45,38,46,12,39,5,41,32,6,14,22,35,32,9,37,33,28,25,0,37,25,38,5,14,6,8,48,45,21,12,35,2,14,48,4,40,16,36,29,47,32,23,27,0,27,21,17,0,38,42,2,39,33,14,32,36,39,36,13,10,36,17]],
  ])("initialRelief is the same as getRelief result (values: %s)", (relief: number[]) => {
    const store = new AquariumStore({ initialRelief: relief });
    expect(store.getRelief()).toStrictEqual(relief);
  });

  test.each([
    [1, Array(1).fill(1)],
    [3, Array(3).fill(1)],
    [9, Array(9).fill(1)],
    [53, Array(53).fill(1)],
    [100, Array(100).fill(1)],
  ])("getWidth() returns width %s for relief array %s", (length, array) => {
    const store = new AquariumStore({ initialRelief: array });
    expect(store.getWidth()).toBe(length);
  });

  test.each([
    [10, [1, 9, 10]],
    [7, [0, 1, 2, 7, 3]],
    [50, [10,1,9,12,6,3,5,5,18,9,1,32,19,14,50,34,47,6,11,15,30,31,26,38,8,30,10,39,13,19,34,48,35,13,6,34,4,8,46,11,42,22,9,27,49,48,11,12,22,17,13,18,0,32,48,20,47,16,8,33]],
    [99, [13,91,2,99,26,59,24,6,52,5,53,60,18,21,54,31,62,97,11,98,79,21,73,82,34,66,5,48,34,60,29,14,56,43,31,97,79,3,84,25,6,29,26,36,69,12,30,90,80,62,68,61,91,77,66,32,55,33,87,10,81,63,16,9,81,79,14,91,98,71,3,99,95,76,39,53,65,28,57,11,97,95,16,36,19,4,83,46,40,63,12,98,14,10,11,5,25,13,83,85]],
  ])("getHeight() returns the biggest number in configuration (%s from %s)", (max, array) => {
    const store = new AquariumStore({ initialRelief: array });
    expect(store.getHeight()).toBe(max);
  });

  test.each([
    ['[,1,2]'],
    ['[1,,2]'],
    ['[1,2,]'],
    ['{1,2,3}]'],
    ['[1,2,3)'],
    ['[a,1,2'],
    ['[ 1 ,_2 , 3]'],
    ['[1 2 3]'],
    ['1, 2, 3'],
    ['1, 2, 3]'],
    ['[1, 2, 3'],
  ])("Invalid configuration %s results in getConfigurationIsValid() = false", (relief) => {
    const store = new AquariumStore({ initialRelief: [1] });
    expect(store.getConfigurationIsValid()).toBeTruthy();
    store.setRelief(relief);
    expect(store.getConfigurationIsValid()).toBeFalsy();
  });

  test("Invalid configuration does not change getRelief results", () => {
    const store = new AquariumStore({ initialRelief: [1] });
    expect(store.getRelief()).toStrictEqual([1]);
    store.setRelief(' 1 2 3 ');
    expect(store.getRelief()).toStrictEqual([1]);
  });

  test("Sort numerically sorts numerically", () => {
    const input = [2, 0, 1, 1002, 9, 12, 51, 536, 3, 8, 9, 24, 99, 101];
    const expected = [0, 1, 2, 3, 8, 9, 9, 12, 24, 51, 99, 101, 536, 1002];

    const store = new AquariumStore({ initialRelief: [1] });
    store.sortNumerically(input)
    expect(input).toStrictEqual(expected);
  });

  test("makeIndexesByHeight makes list of indexes of heights", () => {
    const store = new AquariumStore({ initialRelief: [59, 42, 1, 11, 5, 94, 9, 3, 11] });
    const indexesByHeight = store.makeIndexesByHeight();
    expect(indexesByHeight).toStrictEqual({
      "1": [2],
      "3": [7],
      "5": [4],
      "9": [6],
      "11": [3, 8],
      "42": [1],
      "59": [0],
      "94": [5],
    });
  });

  test.each([
    [0, [1]],
    [0, [11,10]],
    [3, [1,0,0,0,1]],
    [3, [10,0,0,0,1]],  
    [10, [10,0,10]],
    [20, [10,0,0,10]],
    [11, [4,0,4,0,5,0,3]],
    [10, [4,2,3,2,5,0,1,3]],
  ])("waterCount %s produced from configuration %s", (waterCount, relief) => {
    const store = new AquariumStore({ initialRelief: relief });
    expect(store.getWaterCount()).toBe(waterCount);
  });

  test.each([
    [[1], [[0,1]]],
    [[11,10], [[0,11],[0,10]]],
    [[1,0,0,0,1], [[0,1],[1,0],[1,0],[1,0],[0,1]]],
    [[10,0,0,0,1], [[0,10],[1,0],[1,0],[1,0],[0,1]]],
    [[10,0,10], [[0,10],[10,0],[0,10]]],
    [[10,0,0,10], [[0,10],[10,0],[10,0],[0,10]]],
    [[4,0,4,0,5,0,3], [[0,4],[4,0],[0,4],[4,0],[0,5],[3,0],[0,3]]],
    [[4,2,3,2,5,0,1,3], [[0,4],[2,2],[1,3],[2,2],[0,5],[3,0],[2,1],[0,3]]],
  ])("proper waterCubesArray produced from configuration %s", (relief, waterCubesArray) => {
    const store = new AquariumStore({ initialRelief: relief });
    expect(store.getWaterCubesArray()).toStrictEqual(waterCubesArray);
  });
});