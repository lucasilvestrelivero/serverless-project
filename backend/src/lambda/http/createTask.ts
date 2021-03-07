import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { CreateTaskRequest } from '../../requests/CreateTaskRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { TaskItem } from './../../models/TaskItem';

const docClient = new AWS.DynamoDB.DocumentClient();
const tasksTable = process.env.TASKS_TABLE;
const logger = createLogger('createTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Print the log in the CloudWatch CreateTask Group
  logger.info('Processing event: ', event);

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  // Get Body of the request
  const taskBody: CreateTaskRequest = JSON.parse(event.body)
  
  // Create a new task ID
  const taskId = uuidv4();
  
  // Creating task object to persist in the database
  const newTask: TaskItem = {
    taskId: taskId,
    createdAt: new Date().toISOString(),
    done: false,
    userId: userId,
    ...taskBody,
  }

  await docClient.put({
    TableName: tasksTable,
    Item: newTask
  }).promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(newTask)
  }
}
