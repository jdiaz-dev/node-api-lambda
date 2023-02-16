import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import { TodoListTable } from "../helpers/consts.js";
import { searchItemSchema } from "../helpers/validators.js";
import { ddbDocClient } from "../core/db.js";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const deleteTodoItem = async (event) => {
  const { id } = event.pathParameters;

  await ddbDocClient.send(
    new DeleteItemCommand({
      TableName: TodoListTable,
      Key: {
        id,
      },
    })
  );
  return {
    statusCode: 200,
    message: "success",
  };
};

export const deleteTodoItemHandlder: any = middy(deleteTodoItem).use([
  httpHeaderNormalizer(),
  jsonBodyParser(),
  validator({ eventSchema: transpileSchema(searchItemSchema) }),
  httpErrorHandler(),
]);
