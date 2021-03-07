/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTaskRequest {
  name: string
  dueDate: string
  done: boolean
}