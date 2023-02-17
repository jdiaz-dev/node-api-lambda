import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";
import { v4 } from "uuid";

import { createItemSchema } from "../helpers/validators.js";
import { ErrorMessages, SucessMessages, TodoListTable } from "../helpers/consts.js";
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
  const command = new PutCommand({
    TableName: TodoListTable,
    Item: newTodoItem,
  });
  try {
    await ddbDocClient.send(command as any as PutItemCommand);

    return {
      status: 201,
      message: SucessMessages.CREATED,
      body: JSON.stringify(newTodoItem),
    };
  } catch (error) {
    return {
      status: 500,
      message: ErrorMessages.INTERNAL,
    };
  }
};

export const createTodoItemHandlder = middy(createTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(createItemSchema) }),
  httpErrorHandler(),
]) as Function;
