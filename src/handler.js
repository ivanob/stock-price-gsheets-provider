"use strict";
const axios = require('axios');
const AWS = require('aws-sdk');
const MAX_ALLOWED_INTERVAL = 6 * 60 * 60 * 1000; //Interval each 6h

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

AWS.config.update({region: 'eu-west-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.prices = async (event) => {
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
        if(timestamp + MAX_ALLOWED_INTERVAL < Date.now()){
          console.log('The reading has expired, a new reading will be query')
          const newValue = await fetchData.f();
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

    // const data = []//[await fetchSingleStock('KRI.AT')]
    // //data.push(await fetchSingleStock('IWDA.AS'))

    // data.push({ticker: "KRI.AT", price: 8.80}) //BORRAR
    // data.push({ticker: "IWDA.AS", price: 71}) //BORRAR
    // data.push({ticker: 'Valentum', price: await fetchPageDataValentum()});
    // console.log(data)
     return {
         statusCode: 200,
         body: JSON.stringify(data),
     };
};

async function fetchPageDataValentum(){
  return new Promise((resolve, reject) => {
    const req = axios.get('https://www.rankia.com/fondos-de-inversion/valentum-valentum-am')
    .then(function(res){
      const content = res.data
      const idx = content.indexOf("rnk-LiquidationValue_LastSessionValue")
      const priceRaw = content.substring(idx, idx+50)
      const price = priceRaw.substring(priceRaw.indexOf(">")+2, priceRaw.indexOf(" EUR"));
      resolve({price: parseFloat(price.replace(',','.')), stock: "Valentum"})
    })
  })
}

async function fetchSingleStock(stockTicker) {
     return new Promise((resolve, reject) => {
        var options = {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile',
          params: {symbol: stockTicker, region: 'US'},
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST
          }
        }
        const req = axios.request(options)
          .then(function(res){
            if (res.statusCode < 200 || res.statusCode >= 300) {
                  return reject(new Error('statusCode=' + res.statusCode));
            }
            return resolve({stock: stockTicker, price: res.data.price.regularMarketPrice.raw})  
        })
        .catch(function(error){
          console.log(error);
        })
    });
}
