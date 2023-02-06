import { expect, describe, it } from "vitest";
import { render } from "@testing-library/react";

describe("react application", () => {
  it("can render an element", () => {
    const component = render(<h1>Hello React root</h1>);
    expect(component.asFragment()).toMatchSnapshot();
  });
});
