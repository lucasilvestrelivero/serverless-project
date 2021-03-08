import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { getTasksByUserId } from '../../businessLogic/taskBL';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('getTasks')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Print the log in the CloudWatch getTasks Group
  logger.info('Processing event: ', event);

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  // Query the task items by user ID.
  const tasks = await getTasksByUserId(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(tasks)
  };
}
