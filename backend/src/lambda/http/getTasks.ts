import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const tasksTable = process.env.TASKS_TABLE;
const logger = createLogger('getTasks')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Print the log in the CloudWatch getTasks Group
  logger.info('Processing event: ', event);

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  // Query the task items by user ID.
  const result = await docClient.query({
    TableName: tasksTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result.Items)
  };
}
