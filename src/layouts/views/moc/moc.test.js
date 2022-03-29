import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import MockAdapter from "axios-mock-adapter";
import Moc from ".";
import { HashRouter } from "react-router-dom";

const mock = new MockAdapter(axios);

// jest.mock("axios");

test("abc", async () => {
  mock
    .onGet("https://jsonplaceholder.typicode.com/todos/1")
    .reply(200, { title: "abc" });
  //   axios.get.mockResolvedValue({ data: { title: "abc" } });

  render(
    <HashRouter>
      <Moc />
    </HashRouter>
  );

  // const x = await waitFor(screen.getByText("abc"));
  // expect(x).toBeInTheDocument();
});
