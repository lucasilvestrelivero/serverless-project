import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { createTask } from '../../businessLogic/taskBL';
import { CreateTaskRequest } from '../../requests/CreateTaskRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const bucketName = process.env.TASKS_S3_BUCKET;
const logger = createLogger('createTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Print the log in the CloudWatch CreateTask Group
  logger.info('Processing event: ', event);

  // pass event to get userId from Authorization Header
  const userId = getUserId(event);

  // Get Body of the request
  const taskBody: CreateTaskRequest = JSON.parse(event.body);

  const newTask = await createTask(taskBody, userId, bucketName)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(newTask)
  }
}
