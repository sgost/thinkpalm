import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { HashRouter } from "react-router-dom";

test("renders learn react link", () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  // const linkElement = screen.getByText(/Pay/i);
  // expect(linkElement).toBeInTheDocument();
});
