import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import { searchItemSchema } from "../helpers/validators.js";
import { TodoListTable } from "../helpers/consts.js";
import { ddbDocClient } from "../core/db.js";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const getTodoItem = async (event) => {
  const { id } = event.pathParameters;

  const result = await ddbDocClient.send(
    new GetItemCommand({
      TableName: TodoListTable,
      Key: {
        id,
      },
    })
  );
  const todoItem = result.Item;

  if (todoItem === undefined) {
    return {
      status: 400,
      message: "Item not found",
    };
  }

  return {
    status: 200,
    message: "sucess",
    body: todoItem,
  };
};

export const getTodoItemHandler: any = middy(getTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(searchItemSchema) }),
  httpErrorHandler(),
]);
