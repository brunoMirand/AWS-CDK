import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const handler: Handler<APIGatewayProxyEvent> = async (event, content: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Lambda ID: ${event.requestContext.requestId}`);
  console.log(`API Gateway: ${content.awsRequestId}`);
  console.log('Event:', event);

  if (event.resource === '/products') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'GET fetch products',
      }),
    }
  }


  if (event.resource === '/products/{id}') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'GET fetch products by id',
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
