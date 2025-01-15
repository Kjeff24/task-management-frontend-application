export interface Task {
  taskId: string;
  name: string;
  description: string;
  userComment: string;
  assignedTo: string;
  status: string;
  createdBy: string;
  deadline: string;
  completedAt: string;
  hasSentDeadlineNotification: string;
}

export interface TaskRequest {
  name: string;
  description: string;
  assignedTo: string;
  deadline: Date;
}

export interface TaskResponse {
  open: Task[],
  completed: Task[],
  expired: Task[]
}

export interface TaskUpdateAssignedToRequest {
  taskId: string;
  assignedTo: string;
}

export interface TaskUpdateStatusRequest {
  taskId: string;
  status: string;
  deadline?: Date;
}

export interface TaskCommentRequest {
  taskId: string;
  comment: string;
}

export interface CommentRequest {
  comment: string;
}