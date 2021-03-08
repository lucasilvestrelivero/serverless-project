import { v4 as uuidv4 } from 'uuid';

import { TaskAccessData } from './../dataLayer/taskDataAccess';
import { TaskItem } from './../models/TaskItem';
import { CreateTaskRequest } from './../requests/CreateTaskRequest';
import { UpdateTaskRequest } from './../requests/UpdateTaskRequest';

const taskAccessData = new TaskAccessData();

export async function createTask(body: CreateTaskRequest,
  userId: string, bucketName: string) {
	// Create a new task ID
	const taskId = uuidv4();

	// Creating task object to persist in the database
	const newTask: TaskItem = {
		taskId: taskId,
		createdAt: new Date().toISOString(),
		done: false,
		userId: userId,
		attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${taskId}`,
		...body,
	}

	await taskAccessData.createTask(newTask);

	return newTask;
}

export async function updateTask(taskId: string, userId: string, updatedTask: UpdateTaskRequest) {
	return taskAccessData.updateTask(taskId, userId, updatedTask);
}

export async function getTasksByUserId(userId: string) {
	return taskAccessData.getTasksByUserId(userId);
}

export async function deleteTask(taskId: string, userId: string) {
	return taskAccessData.deleteTask(taskId, userId);
}

export function getUploadUrl(itemId: string) {
	return taskAccessData.getUploadUrl(itemId);
}