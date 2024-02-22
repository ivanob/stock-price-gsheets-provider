import { SinglePriceHandler, StockCurrentPrice } from "./types";
import axios from "axios";
import * as cheerio from "cheerio";

export const fetchFinancialTimesStock: SinglePriceHandler = async (
    stockTicker: string
  ): Promise<StockCurrentPrice> => {
    return new Promise(async (resolve, reject) => {
        try{
            const res = await axios.get(
                `https://markets.ft.com/data/equities/tearsheet/summary?s=${stockTicker}`
            );
            const $ = cheerio.load(res.data);
            const stockInfo: StockCurrentPrice = {
                price: -1,
                stock: stockTicker,
                dailyChange: -1
            }
            const spans = $(".mod-tearsheet-overview__quote__bar").find("span.mod-ui-data-list__value").each( (i, val ) => {
                if(i === 0){ // Value
                    stockInfo.price = parseFloat($(val).text());
                }
                else if(i === 1){ // Daily change
                    const percentageStr = $(val).text();
                    const percentage = percentageStr.split(' / ')[1].slice(0, -1);
                    stockInfo.dailyChange = parseFloat(percentage);
                }
            })
            
            resolve(stockInfo)
        }
        catch(error){
            reject();
        }
    });
}