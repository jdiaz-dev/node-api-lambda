import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import { updateItemSchema } from "../helpers/validators.js";
import { ErrorMessages, SucessMessages, TodoListTable } from "../helpers/consts.js";
import { ddbDocClient } from "../core/db.js";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const updateTodoItem = async (event) => {
  const body = event.body;
  const { id } = event.pathParameters;

  let dynamicUpdate = {
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  const dynamicComma = (index, arr) => `${index !== arr.length - 1 ? "," : ""}`;
  Object.entries(body).forEach(([key, item], index, arr) => {
    dynamicUpdate.UpdateExpression += ` #${key} = :${key}${dynamicComma(
      index,
      arr
    )}`;
    dynamicUpdate.ExpressionAttributeNames[`#${key}`] = key;
    dynamicUpdate.ExpressionAttributeValues[`:${key}`] = item;
  });

  const command = new UpdateCommand({
    TableName: TodoListTable,
    Key: {
      id,
    },
    ...dynamicUpdate,
    ReturnValues: "ALL_NEW",
  });
  try {
    const res = await ddbDocClient.send(command as any as UpdateItemCommand);
    return {
      status: 201,
      message: SucessMessages.UPDATED,
      body: JSON.stringify(res.Attributes),

    };
  } catch (error) {
    return {
      status: 500,
      message: ErrorMessages.INTERNAL
    };
  }
};

export const updateTodoItemHandlder = middy(updateTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({
    eventSchema: transpileSchema(updateItemSchema, {
      strict: true,
    }),
  }),
  httpErrorHandler(),
]) as Function;
