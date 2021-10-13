import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { SquaresGraph } from '../squares-graph';

let container: Element;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  cleanup();
});

describe("SquaresGraph tests", () => {
  test("Canvas element gets proper width and height", () => {
    render(
      <SquaresGraph
        widthPx={500}
        heightPx={400}
        height={1}
        cellSize={1}
        waterCubesArray={[[1]]}
      />,
      { container }
    );

    const canvasEl = document.querySelector("canvas");
    expect(canvasEl).toHaveAttribute("width", "500");
    expect(canvasEl).toHaveAttribute("height", "400");
  });
});