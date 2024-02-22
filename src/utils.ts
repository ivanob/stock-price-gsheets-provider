import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ConfigUser, StockConfig, StockCurrentPrice } from './fetchers/types';

AWS.config.update({region: 'eu-west-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

export type RespDB = {
    timestamp: number,
    price: number,
    dailyChange: number
}

export type RespUserConfig = {
  user: string,
  wallet: 
    {
      ticker: string,
      type: string,
      description: string
    }[]
}

export const queryPriceDB = async (ticker: string): Promise<RespDB> => {
  //TODO: fix this, can not have the table hardcoded
   const readingStock = await ddb.getItem({TableName: 'historical-prices', Key: {
    'ticker': {S: ticker}
  }}).promise();
  return {
      timestamp: parseInt(readingStock.Item.lastReading.N),
      price: parseFloat(readingStock.Item.price.N),
      dailyChange: parseFloat(readingStock.Item.dailyChange.N)
  }
}

export const queryUserConfig = async (user: string): Promise<ConfigUser> => {
  //TODO: fix this, can not have the table hardcoded
   const readingConfig = await ddb.getItem({TableName: 'config-users-prices', Key: {
    'id': {S: '1'}
  }}).promise();
  // console.log(.at(0).M.ticker.S)
  const wallet: StockConfig[] = readingConfig.Item.wallet.L.map(x => ({
    ticker: x.M.ticker.S,
    type: x.M.type.S,
    description: x.M.description.S,
    fetcher: x.M.fetcher.S
  }))
  return {
      user: readingConfig.Item.user.S,
      wallet
  }
}

export const insertPriceDB = async (data: StockCurrentPrice) => {
    const params: DocumentClient.UpdateItemInput = {
        TableName:'historical-prices',
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