import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";
import { v4 } from "uuid";

import { createItemSchema } from "../helpers/validators.js";
import { TodoListTable } from "../helpers/consts.js";
import { ddbDocClient } from "../core/db.js";

const createTodoItem = async (event) => {
  const { taskName, status, dueDate, notes } = event.body;
  const id = v4();

  const newTodoItem = {
    id,
    taskName,
    dueDate,
    notes,
    status,
  };

  await ddbDocClient.send(
    new PutItemCommand({
      TableName: TodoListTable,
      Item: newTodoItem,
    })
  );

  console.log("------------res2");
  return {
    statusCode: 201,
    message: "success",
    body: newTodoItem,
  };
};

export const createTodoItemHandlder: any = middy(createTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(createItemSchema) }),
  httpErrorHandler(),
]);
