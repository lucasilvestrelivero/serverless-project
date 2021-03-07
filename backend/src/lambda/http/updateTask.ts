import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { UpdateTaskRequest } from '../../requests/UpdateTaskRequest';
import { createLogger } from '../../utils/logger';
import { TaskItem } from './../../models/TaskItem';

const docClient = new AWS.DynamoDB.DocumentClient();
const tasksTable = process.env.TASKS_TABLE;
const tasksIdTable = process.env.TASK_ID_INDEX;
const logger = createLogger('updateTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Print the log in the CloudWatch CreateTask Group
  logger.info('Processing event: ', event);

  const taskId = event.pathParameters.taskId
  const updatedTask: UpdateTaskRequest = JSON.parse(event.body);

  // Query the task item by task ID.
  const result = await docClient.query({
    TableName: tasksTable,
    IndexName: tasksIdTable,
    KeyConditionExpression: 'taskId = :taskId',
    ExpressionAttributeValues: {
      ':taskId': taskId
    },
    ScanIndexForward: false
  }).promise();

  const item: TaskItem = result.Items[0] as TaskItem;

  const updateItem = await docClient.update({
    TableName: tasksTable,
    Key: {
      userId: item.userId,
      createdAt: item.createdAt
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

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(updateItem.Attributes)
  };
}
