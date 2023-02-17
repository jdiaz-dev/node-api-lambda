import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbDocClient } from "../core/db.js";
import {
  ErrorMessages,
  SucessMessages,
  TodoListTable,
} from "../helpers/consts.js";

export const getTodoItemsHandler = async (event) => {
  try {
    const { Items } = await ddbDocClient.send(
      new ScanCommand({
        TableName: TodoListTable,
      })
    );
    return {
      status: 200,
      message: SucessMessages.GETTING,
      body: JSON.stringify({
        todoItems: Items?.map((item) => unmarshall(item)),
      }),
    };
  } catch (error) {
    return {
      status: 500,
      message: ErrorMessages.INTERNAL,
    };
  }
};
