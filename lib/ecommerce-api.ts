import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { ECommerceApiStackProps } from './interfaces';

export class ECommerceApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props);

    const log = new logs.LogGroup(this, 'ECommerceApiLogs');
    const api = new apigateway.RestApi(this, 'ECommerceApi', {
      restApiName: 'ECommerceApi',
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(log),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: false,
          status: true,
          caller: true,
          user: true
        }),
      },
    });

    const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetch);
    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', productsFetchIntegration);
  }
}
