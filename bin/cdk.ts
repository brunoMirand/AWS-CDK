#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ECommerceApi } from '../lib/ecommerce-api';
import { ProductsAppStack } from '../lib/products-app-stack';
import { envs } from '../env';

const app = new cdk.App();
const env: cdk.Environment = {
  account: envs.ACCESS_COUNT_ID,
  region: envs.REGION,
};
const tags = {
  cost: 'ECommerce',
  team: 'Travolt',
}

const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  tags,
  env
});

const ecommerceApiStack = new ECommerceApi(app, 'ECommerceApi', {
  productsFetch: productsAppStack.productsFetch,
  productsAdmin: productsAppStack.productsAdmin,
  tags,
  env
});

ecommerceApiStack.addDependency(productsAppStack);
