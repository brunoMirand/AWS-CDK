import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface Product {
  id: string;
  productName: string;
  code: string;
  price: number;
  model: string;
}

export class ProductRepository {
  constructor(private dbClient: DocumentClient,  private dbProducts: string) {}

  async listProducts(): Promise<Product[]> {
    const result = await this.dbClient.scan({
      TableName: this.dbProducts
    }).promise();

    return result.Items as Product[]
  }

  async listProductById(id: string): Promise<Product> {
    const result = await this.dbClient.get({
      TableName: this.dbProducts,
      Key: {
        id,
      }
    }).promise();

    if (!result.Item) {
      throw new Error('Product not found.');
    }

    return result.Item as Product;
  }
}
