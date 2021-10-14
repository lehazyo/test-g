import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { SquaresContainer } from '../squares-container';

let container: Element;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  cleanup();
});

describe("SquaresContainer tests", () => {
  test("Adding SquaresContainer does not cause any errors", () => {
    expect(() => { render(<SquaresContainer/>) }).not.toThrowError();
  });
});