import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaLayer from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class ProductsAppStack extends cdk.Stack {
  productsFetch: lambda.NodejsFunction;
  productsAdmin: lambda.NodejsFunction;
  productsDatabase: dynamodb.Table;
  productLayer: lambdaLayer.ILayerVersion;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.makeDatabase();
    this.makeFetchLambda();
    this.makeAdminLambda();
    this.setPermissionsOnDatabase();
    this.productLayer = this.getLambdaLayer();
  }

  makeFetchLambda(): void {
    this.productsFetch = new lambda.NodejsFunction(
      this,
      'ProductsFetch',
      {
        runtime: lambdaLayer.Runtime.NODEJS_18_X,
        functionName: 'ProductsFetch',
        entry: 'lambda/products/fetch.ts',
        handler: 'handler',
        memorySize: 512,
        timeout: cdk.Duration.seconds(4),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          DATABASE_NAME: this.productsDatabase.tableName,
        },
        layers: [this.productLayer]
      },
    );
  }

  makeAdminLambda(): void {
    this.productsAdmin = new lambda.NodejsFunction(
      this,
      'ProductsAdmin',
      {
        runtime: lambdaLayer.Runtime.NODEJS_18_X,
        functionName: 'ProductsAdmin',
        entry: 'lambda/products/admin.ts',
        handler: 'handler',
        memorySize: 512,
        timeout: cdk.Duration.seconds(4),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          DATABASE_NAME: this.productsDatabase.tableName,
        },
        layers: [this.productLayer],
      },
    )
  }

  makeDatabase(): void {
    this.productsDatabase = new dynamodb.Table(this, 'ProductsDatabase',  {
      tableName: 'products',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });
  }

  setPermissionsOnDatabase(){
    this.productsDatabase.grantReadData(this.productsFetch);
    this.productsDatabase.grantReadWriteData(this.productsAdmin);
  }

  getLambdaLayer(): lambdaLayer.ILayerVersion {
    const layerVersion = ssm.StringParameter.valueForStringParameter(this, 'ProductsLayerVersionArn');
    const layer = lambdaLayer.LayerVersion.fromLayerVersionArn(this, 'ProductsLayerVersionArn', layerVersion);
    console.log(layer);
    return layer;
  }
}
