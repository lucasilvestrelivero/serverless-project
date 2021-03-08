import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { deleteTask } from '../../businessLogic/taskBL';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('deleteTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   // Print the log in the CloudWatch getTasks Group
   logger.info('Processing event: ', event);
  
   // Get taksId from ULR
  const taskId = event.pathParameters.taskId;

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  const message = await deleteTask(taskId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(message)
  }
}
