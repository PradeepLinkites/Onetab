import { render } from "@testing-library/react";
import UserService from "./userService";
describe("Apiservice", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<UserService />);
    expect(baseElement).toBeTruthy();
  });
});
