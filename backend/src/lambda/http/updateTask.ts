import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { updateTask } from '../../businessLogic/taskBL';
import { UpdateTaskRequest } from '../../requests/UpdateTaskRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('updateTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Print the log in the CloudWatch CreateTask Group
  logger.info('Processing event: ', event);

  const taskId = event.pathParameters.taskId
  const updatedTask: UpdateTaskRequest = JSON.parse(event.body);

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  const taskUpdated = await updateTask(taskId, userId, updatedTask);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(taskUpdated)
  };
}
