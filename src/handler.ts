import * as AWS from 'aws-sdk';
import { fetchPageDataValentum } from './handlers/custom.handlers';
import { fetchSingleStock } from './handlers/yahoo.finance.handler';
const MAX_ALLOWED_INTERVAL = 6 * 60 * 60 * 1000; //Interval each 6h

AWS.config.update({region: 'eu-west-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

const isMarketOpen = () => {
  const now = new Date();
  if(now.getDay()>5) return false
  if(now.getHours()<8 || now.getHours() > 18) return false
  return true;
}

export const prices = async (event: any) => {
    const data = [];
    const funcs = [{f: () => fetchPageDataValentum(), ticker: 'Valentum'}, 
    {f:() => fetchSingleStock("KRI.AT"), ticker: "KRI.AT"},
    {f:() => fetchSingleStock("IWDA.AS"), ticker: "IWDA.AS"}]
    for(var i = 0; i < funcs.length; i++){
        const fetchData = funcs[i];
        const readingStock = await ddb.getItem({TableName: 'historicalPrices', Key: {
          'ticker': {S: fetchData.ticker}
        }}).promise()
        const timestamp = parseInt(readingStock.Item.lastReading.N);
        if(isMarketOpen() && timestamp + MAX_ALLOWED_INTERVAL < Date.now()){
          console.log('The reading has expired, a new reading will be query')
          const newValue: any = await fetchData.f();
          console.log('NEW', newValue);
          var params = {
            TableName:'historicalPrices',
            Key:{
              "ticker": fetchData.ticker
            },
            UpdateExpression: "set lastReading=:time, price=:price",
            ExpressionAttributeValues:{
                ":time":Date.now(),
                ":price":newValue.price,
              },
            ReturnValues:"UPDATED_NEW"
          };
          await docClient.update(params).promise();
          data.push({ticker: fetchData.ticker, price: newValue.price})
        }else{
          console.log('READ', readingStock)
          data.push({ticker: fetchData.ticker, price: readingStock.Item.price.N})
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
