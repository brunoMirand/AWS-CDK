import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ProductsAppStack extends cdk.Stack {
  readonly productsFetch: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.productsFetch = new lambda.NodejsFunction(
      this,
      'ProductsFetch',
      {
        functionName: 'ProductsFetch',
        entry: 'lambda/products/products-fetch.ts',
        handler: 'handler',
        memorySize: 512,
        timeout: cdk.Duration.seconds(4),
        bundling: {
          minify: true,
          sourceMap: false,
        },
      },
    );
  }
}
