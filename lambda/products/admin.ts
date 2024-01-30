import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const handler: Handler<APIGatewayProxyEvent> = async (event, content: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Lambda ID: ${event.requestContext.requestId}`);
  console.log(`API Gateway: ${content.awsRequestId}`);
  console.log('Event:', event);

  if (event.resource === '/products') {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'POST products',
      }),
    }
  }

  if (event.httpMethod === 'PUT' && event.resource === '/products/{id}') {
    return {
      statusCode: 204,
      body: JSON.stringify({
        message: 'PUT products by id',
      }),
    }
  }

  if (event.httpMethod === 'DELETE' && event.resource === '/products/{id}') {
    return {
      statusCode: 204,
      body: JSON.stringify({
        message: 'DELETE products by id',
      }),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad Request',
    }),
  }
}
