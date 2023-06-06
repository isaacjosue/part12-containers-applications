import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

const todo = {
  text: "Example todo",
  done: false,
};

describe("Todo", () => {
  const onClickComplete = jest.fn(() => todo.done = true);
  const onClickDelete = jest.fn();
  render(
    <Todo
      todo={todo}
      onClickComplete={() => onClickComplete}
      onClickDelete={() => onClickDelete}
    />
  );

  describe("Content", () => {
    test("Should display appropriate text", () => {
      const text = screen.getByText(todo.text);

      expect(text).toBeDefined();
    });
  });
});
