export const createItemSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        taskName: { type: "string", minLength: 3, maxLength: 20 },
        status: {
          type: "string",
          enum: ["not started", "in progress", "completed"],
        },
        dueDate: { type: "string", minLength: 10, maxLength: 10 },
        notes: { type: "string", minLength: 3, maxLength: 40 },
      },
      required: ["taskName", "status", "dueDate", "notes"],
    },
  },
};

export const updateItemSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        taskName: { type: "string", minLength: 3, maxLength: 20 },
        status: {
          type: "string",
          enum: ["not started", "in progress", "completed"],
        },
        dueDate: { type: "string", minLength: 10, maxLength: 10 },
        notes: { type: "string", minLength: 3, maxLength: 40 },
      },
    },
  },
};

export const searchItemSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
  },
  required: ["pathParameters"],
};
