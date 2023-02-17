import { GetItemCommand } from "@aws-sdk/client-dynamodb";

import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import { searchItemSchema } from "../helpers/validators.js";
import {
  ErrorMessages,
  SucessMessages,
  TodoListTable,
} from "../helpers/consts.js";
import { ddbDocClient } from "../core/db.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const getTodoItem = async (event) => {
  const { id } = event.pathParameters;

  const command = new GetCommand({
    TableName: TodoListTable,
    Key: {
      id,
    },
  });

  try {
    const { Item } = await ddbDocClient.send(command as any as GetItemCommand);
    if (Item === undefined) {
      return {
        status: 404,
        message: ErrorMessages.ITEM_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: SucessMessages.GETTING,
      body: JSON.stringify(Item),
    };
  } catch (error) {
    return {
      status: 500,
      message: ErrorMessages.INTERNAL,
    };
  }
};

export const getTodoItemHandler = middy(getTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(searchItemSchema) }),
  httpErrorHandler(),
]) as Function;
