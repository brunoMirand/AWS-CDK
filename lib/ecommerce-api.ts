import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { ECommerceApiStackProps } from './interfaces';

export class ECommerceApi extends cdk.Stack {
  private restApi: apigateway.RestApi;
  private rootResource: apigateway.Resource;
  private parameterResource: apigateway.Resource;

  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props);
    this.restApi = this.makeRestApiGateway();
    this.rootResource = this.createApiResource();
    this.parameterResource = this.createParametersResource();
    this.makeFetchResource(props);
    this.makeAdminResource(props);

  }

  makeRestApiGateway(): apigateway.RestApi {
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

    return api;
  }

  makeFetchResource(props: ECommerceApiStackProps): void {
    const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetch);

    this.rootResource.addMethod('GET', productsFetchIntegration);

    const productIdResource = this.parameterResource;
    productIdResource.addMethod('GET', productsFetchIntegration);
  }

  makeAdminResource(props: ECommerceApiStackProps): void {
    const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdmin);

    this.rootResource.addMethod('POST', productsAdminIntegration);

    const productsIdResource = this.parameterResource;
    productsIdResource.addMethod('DELETE', productsAdminIntegration);
    productsIdResource.addMethod('PUT', productsAdminIntegration);
  }

  createApiResource(): apigateway.Resource {
    const resource = this.restApi.root.addResource('products');
    return resource;
  }

  createParametersResource(): apigateway.Resource {
    return this.rootResource.addResource('{id}');
  }
}
