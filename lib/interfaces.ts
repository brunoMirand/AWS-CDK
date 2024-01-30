import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetch: lambda.NodejsFunction;
  productsAdmin: lambda.NodejsFunction;
}
