import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const handler: Handler<APIGatewayProxyEvent> = async (event, content: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Lambda ID: ${event.requestContext.requestId}`);
  console.log(`API Gateway: ${content.awsRequestId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'GET Products Fetch',
    }),
  }
}
