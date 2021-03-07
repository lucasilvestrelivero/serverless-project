import { TaskItem } from './../../models/TaskItem';
import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { createLogger } from '../../utils/logger';

const docClient = new AWS.DynamoDB.DocumentClient();
const tasksTable = process.env.TASKS_TABLE;
const tasksIdTable = process.env.TASK_ID_INDEX;
const logger = createLogger('deleteTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   // Print the log in the CloudWatch getTasks Group
   logger.info('Processing event: ', event);
  
   // Get taksId from ULR
  const taskId = event.pathParameters.taskId;

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

  // Query the task items by user ID.
  await docClient.delete({
    TableName: tasksTable,
    Key: {
      userId: item.userId,
      createdAt: item.createdAt
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
