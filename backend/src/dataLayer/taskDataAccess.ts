import { TaskDeleteMessage } from './../models/TaskDeleteMessage';
import { UpdateTaskRequest } from './../requests/UpdateTaskRequest';
import { TaskItem } from './../models/TaskItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS  from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS);

export class TaskAccessData {
    constructor(
			private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
			private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
			private readonly tasksTable = process.env.TASKS_TABLE,
			private readonly bucketName = process.env.TASKS_S3_BUCKET,
			private readonly ulrTimeExpiration = +process.env.SIGNED_URL_EXPIRATION_SECONDS,
    ) {}

	async createTask(newTask: TaskItem) {
		await this.docClient.put({
			TableName: this.tasksTable,
			Item: newTask
		}).promise();			
	}

	async getTasksByUserId(userId: string): Promise<TaskItem[]> {
		// Query the task item by user ID.
		const result = await this.docClient.query({
			TableName: this.tasksTable,
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
			  ':userId': userId
			},
			ScanIndexForward: false
		  }).promise();

		return result.Items as TaskItem[]
	}

	async deleteTask(taskId: string, userId: string): Promise<TaskDeleteMessage> {
		// Query the task items by user ID.
		await this.docClient.delete({
			TableName: this.tasksTable,
			Key: {
				userId: userId,
				taskId: taskId
			}
		}).promise();

		return {
			message: 'item deleted successfully'
		}
	}

	async updateTask(taskId: string, userId: string, updatedTask: UpdateTaskRequest): Promise<TaskItem> {
		const updateItem = await this.docClient.update({
			TableName: this.tasksTable,
			Key: {
			  userId: userId,
			  taskId: taskId
			},
			UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
			ExpressionAttributeValues: {
			  ":name": updatedTask.name,
			  ":dueDate": updatedTask.dueDate,
			  ":done": updatedTask.done
			},
			ExpressionAttributeNames: {
			  "#name": "name"
			},
			ReturnValues: "ALL_NEW"
		  }).promise();

		  return updateItem.Attributes as TaskItem
	}

	getUploadUrl(itemId: string) {
		return this.s3.getSignedUrl('putObject', {
			Bucket: this.bucketName,
			Key: itemId,
			Expires: this.ulrTimeExpiration,
		})
	}
    
}