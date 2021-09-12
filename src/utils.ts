import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StockCurrentPrice } from './handlers/types';

AWS.config.update({region: 'eu-west-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

export type RespDB = {
    timestamp: number,
    price: number,
    dailyChange: number
}

export const queryPriceDB = async (ticker: string): Promise<RespDB> => {
   const readingStock = await ddb.getItem({TableName: 'historicalPrices', Key: {
    'ticker': {S: ticker}
  }}).promise();
  return {
      timestamp: parseInt(readingStock.Item.lastReading.N),
      price: parseFloat(readingStock.Item.price.N),
      dailyChange: parseFloat(readingStock.Item.dailyChange.N)
  }
}

export const insertPriceDB = async (data: StockCurrentPrice) => {
    const params: DocumentClient.UpdateItemInput = {
        TableName:'historicalPrices',
        Key:{
          "ticker": data.stock
        },
        UpdateExpression: "set lastReading=:time, price=:price, dailyChange=:change",
        ExpressionAttributeValues:{
            ":time":Date.now(),
            ":price":data.price,
            ":change":data.dailyChange
          },
        ReturnValues:"UPDATED_NEW"
      };
    return await docClient.update(params).promise();
}

export const isMarketOpen = () => {
    const now = new Date();
    if(now.getDay()>5) return false
    if(now.getHours()<8 || now.getHours() > 18) return false
    return true;
}