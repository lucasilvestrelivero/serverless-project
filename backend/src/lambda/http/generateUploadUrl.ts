import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { getUploadUrl } from '../../businessLogic/taskBL';
import { createLogger } from '../../utils/logger';

const logger = createLogger('uploadURL')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Print the log in the CloudWatch CreateTask Group
  logger.info('Processing event: ', event);

  const taskId = event.pathParameters.taskId;

  const url = getUploadUrl(taskId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({uploadUrl: url})
  };
}