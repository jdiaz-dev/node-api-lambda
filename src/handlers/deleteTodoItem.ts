import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import {
  ErrorMessages,
  SucessMessages,
  TodoListTable,
} from "../helpers/consts.js";
import { searchItemSchema } from "../helpers/validators.js";
import { ddbDocClient } from "../core/db.js";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const deleteTodoItem = async (event) => {
  const { id } = event.pathParameters;

  const command = new DeleteCommand({
    TableName: TodoListTable,
    Key: {
      id,
    },
  });
  try {
    const res = await ddbDocClient.send(command as any as DeleteItemCommand);
    return {
      status: 200,
      message: SucessMessages.DELETED,
    };
  } catch (error) {
    return {
      status: 500,
      message: ErrorMessages.INTERNAL,
    };
  }
};

export const deleteTodoItemHandlder = middy(deleteTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(searchItemSchema) }),
  httpErrorHandler(),
]) as Function;
