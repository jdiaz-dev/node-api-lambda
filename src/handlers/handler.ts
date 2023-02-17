import { ErrorMessages, Others, todoPath } from "../helpers/consts";
import { createTodoItemHandlder } from "./createTodoItem";
import { deleteTodoItemHandlder } from "./deleteTodoItem";
import { getTodoItemHandler } from "./getTodoItem";
import { getTodoItemsHandler } from "./getTodoItems";
import { updateTodoItemHandlder } from "./updateTodoItem";

export const handler = async function (event) {
  const { method, path } = event.requestContext.http;
  const { pathParameters } = event;
  const domainPath = path.split("/")[1];
  let response;
  switch (true) {
    case method === "POST" && domainPath === todoPath:
      response = await createTodoItemHandlder(event);

      break;
    case method === "GET" && domainPath === todoPath && !pathParameters:
      response = await getTodoItemsHandler(event);

      break;

    case method === "GET" &&
      domainPath === todoPath &&
      typeof pathParameters?.id === Others.STRING:
      response = await getTodoItemHandler(event);
      break;
    case method === "PUT" && domainPath === todoPath:

      response = await updateTodoItemHandlder(event);
      break;
    case method === "DELETE" && domainPath === todoPath:
      response = await deleteTodoItemHandlder(event);
      break;
    default:
      response = {
        status: 404,
        message: ErrorMessages.NOT_FOUND,
      };
  }
  return response;
};


