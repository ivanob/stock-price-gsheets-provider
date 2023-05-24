import { StockCurrentPrice } from "./handlers/types";
import { queries, StockQuery } from "./stocks-config";
import { insertPriceDB, isMarketOpen, queryPriceDB, RespDB } from "./utils";

export const prices = async (event: any) => {
    const data = [];
    const funcs = queries;
    for(var i = 0; i < funcs.length; i++){
        const fetchData: StockQuery = funcs[i];
        // const readingStock: RespDB = await queryPriceDB(fetchData.ticker);
        // if(isMarketOpen() && readingStock.timestamp + fetchData.periodicity < Date.now()){
        //   console.log('The reading has expired, a new reading will be query')
          const newValue: StockCurrentPrice = await fetchData.handler();
        //   console.log('NEW', newValue);
        //   await insertPriceDB(newValue);
          data.push({ticker: fetchData.ticker, price: newValue.price, dailyChange: newValue.dailyChange})
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
