import { ConfigUser, StockConfig, StockCurrentPrice } from "./fetchers/types";
import { fetchYahooMultipleStock } from "./fetchers/yahoo-finance-fetch";
import {
  queryUserConfig,
} from "./utils";

export const prices = async (event: any) => {
  const wallet: StockConfig[] = (await queryUserConfig("11111")).wallet.sort((a,b) => {return a.type === 'stock' ? -1 : 1});
  const tickers = wallet.map((stock: StockConfig) => stock.ticker);
  return fetchYahooMultipleStock(tickers)
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    })
    .catch((error) => {
      console.log("Ticker not found");
    });

  // const readingStock: RespUserConfig = await queryUserConfig("1");
  // console.log(readingStock)
  // if(isMarketOpen() && readingStock.timestamp + fetchData.periodicity < Date.now()){
  //   console.log('The reading has expired, a new reading will be query')
  // const newValue: StockCurrentPrice = await fetchData.handler();
  //   console.log('NEW', newValue);
  //   await insertPriceDB(newValue);
  // data.push({ticker: stock.ticker, price: newValue.price, dailyChange: newValue.dailyChange})
  // }else{
  //   console.log('READ', readingStock)
  //   data.push({ticker: fetchData.ticker, price: readingStock.price, dailyChange: readingStock.dailyChange})
  // }
};
