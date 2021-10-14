import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { Aquarium } from '../aquarium';

let container: Element;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  cleanup();
});

describe("Aquarium tests", () => {
  test("Adding Aquarium does not cause any errors", () => {
    expect(() => { render(<Aquarium/>) }).not.toThrowError();
  });
});