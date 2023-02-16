import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../core/db.js";
import { TodoListTable } from "../helpers/consts.js";

export const getTodoItemsHandler: any = async () => {
  const result = await ddbDocClient.send(
    new ScanCommand({
      TableName: TodoListTable,
    })
  );

  const todoItems = result.Items;
  return {
    status: 200,
    message: "success",
    body: {
      todoItems,
    },
  };
};
