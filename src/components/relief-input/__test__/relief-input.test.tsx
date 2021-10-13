import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { AquariumStore } from '../../../mobx/aquarium-store';
import { AquariumContext } from '../../aquarium/aquarium';
import { ReliefInput } from '../relief-input';

let container: Element;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  cleanup();
});

describe("ReliefInput tests", () => {
  test("Text labels and input are visible; input text corresponds initialRelief prop; invalid input message is invisible", () => {
    const initialRelief = [1,2,3,4,5];
    const aquariumStore = new AquariumStore({ initialRelief });
    render(
      <AquariumContext.Provider value={aquariumStore}>
        <ReliefInput
          initialRelief={initialRelief}
        />
      </AquariumContext.Provider>,
      { container }
    );

    expect(screen.getByText("Configuration")).toBeVisible();
    expect(screen.getByDisplayValue("[1,2,3,4,5]")).toBeVisible();
    expect(screen.getByText("has water volume 0")).toBeVisible();
    expect(screen.queryByText("is invalid")).toBeNull();
  });

  test("If input is invalid, message about it is visible", () => {
    const initialRelief = [1,2,3,4,5];
    const aquariumStore = new AquariumStore({ initialRelief });
    render(
      <AquariumContext.Provider value={aquariumStore}>
        <ReliefInput
          initialRelief={initialRelief}
        />
      </AquariumContext.Provider>,
      { container }
    );
    aquariumStore.setRelief('1 2 3');

    expect(screen.getByText("Configuration")).toBeVisible();
    expect(screen.getByDisplayValue("[1,2,3,4,5]")).toBeVisible();
    expect(screen.queryByText("has water volume 0")).toBeNull();
    expect(screen.getByText("is invalid")).toBeVisible();
  });
});