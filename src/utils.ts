import * as AWS from 'aws-sdk';
import { DocumentClient, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { StockCurrentPrice } from './handlers/types';
import { StockQuery } from './stocks-config';

AWS.config.update({region: 'eu-west-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

export type RespDB = {
    timestamp: number,
    price: number
}

export const queryPriceDB = async (ticker: string): Promise<RespDB> => {
   const readingStock = await ddb.getItem({TableName: 'historicalPrices', Key: {
    'ticker': {S: ticker}
  }}).promise();
  return {
      timestamp: parseInt(readingStock.Item.lastReading.N),
      price: parseInt(readingStock.Item.price.N)
  }
}

export const insertPriceDB = async (data: StockCurrentPrice) => {
    const params: DocumentClient.UpdateItemInput = {
        TableName:'historicalPrices',
        Key:{
          "ticker": data.stock
        },
        UpdateExpression: "set lastReading=:time, price=:price",
        ExpressionAttributeValues:{
            ":time":Date.now(),
            ":price":data.price,
          },
        ReturnValues:"UPDATED_NEW"
      };
    return await docClient.update(params).promise();
}