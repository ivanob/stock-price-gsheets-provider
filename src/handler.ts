import { ConfigUser, StockConfig, StockCurrentPrice } from "./handlers/types";
import { insertPriceDB, isMarketOpen, queryPriceDB, queryUserConfig, RespDB, RespUserConfig } from "./utils";

export const prices = async (event: any) => {
    const data = [];
    const wallet: StockConfig[] = (await queryUserConfig("11111")).wallet;
    for(let stock in wallet){
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
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
