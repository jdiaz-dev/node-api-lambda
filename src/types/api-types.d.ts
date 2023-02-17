export enum Status {
  notStarted = "not started",
  inProgress = "in progress",
  completed = "completed",
}

export type TodoItem = {
  taskName: string;
  status: "not started" | "in progress" | "completed";
  dueDate: string;
  notes: string;
};

export type TodoItems = TodoItem[];
