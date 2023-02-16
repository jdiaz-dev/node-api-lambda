import { createTodoItemHandlder } from "./createTodoItem";
import { deleteTodoItemHandlder } from "./deleteTodoItem";
import { getTodoItemHandler } from "./getTodoItem";
import { getTodoItemsHandler } from "./getTodoItems";
import { updateTodoItemHandlder } from "./updateTodoItem";

const todoPath = "/todos";

export const mainHandler = async function (event) {
  console.log("---------Request event: ", event);
  let response;
  switch (true) {
    case event.httpMethod === "POST" && event.path === todoPath:
      console.log("--------response");
      response = await createTodoItemHandlder(event);
      break;
    case event.httpMethod === "GET" && event.path === todoPath:
      response = await getTodoItemsHandler(event);
      break;
    case event.httpMethod === "GET" &&
      event.path === todoPath &&
      event.pathParameters:
      response = await getTodoItemHandler(event);
      break;
    case event.httpMethod === "PUT" && event.path === todoPath:
      response = await updateTodoItemHandlder(event);
      break;
    case event.httpMethod === "DELETE" && event.path === todoPath:
      response = await deleteTodoItemHandlder(event);
      break;
    default:
      response = "buildResponse(404, '404 Not Found');";
  }
  return response;
};
