import { StockCurrentPrice } from "./handlers/types";
import { queries, StockQuery } from "./stocks-config";
import { insertPriceDB, queryPriceDB, RespDB } from "./utils";

const isMarketOpen = () => {
  const now = new Date();
  if(now.getDay()>5) return false
  if(now.getHours()<8 || now.getHours() > 18) return false
  return true;
}

export const prices = async (event: any) => {
    const data = [];
    /*const funcs = [{f: () => fetchPageDataValentum(), ticker: 'Valentum'}, 
    {f:() => fetchSingleStock("KRI.AT"), ticker: "KRI.AT"},
    {f:() => fetchSingleStock("IWDA.AS"), ticker: "IWDA.AS"}]*/
    const funcs = queries;
    for(var i = 0; i < funcs.length; i++){
        const fetchData: StockQuery = funcs[i];
        const readingStock: RespDB = await queryPriceDB(fetchData.ticker);
        if(isMarketOpen() && readingStock.timestamp + fetchData.periodicity < Date.now()){
          console.log('The reading has expired, a new reading will be query')
          const newValue: StockCurrentPrice = await fetchData.handler();
          console.log('NEW', newValue);
          await insertPriceDB(newValue);
          data.push({ticker: fetchData.ticker, price: newValue.price})
        }else{
          console.log('READ', readingStock)
          data.push({ticker: fetchData.ticker, price: readingStock.price})
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
