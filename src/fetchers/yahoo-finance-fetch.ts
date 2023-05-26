import yahooFinance from "yahoo-finance2";
import { MultiPriceHandler, StockCurrentPrice } from "./types";
import {
  Quote,
  QuoteResponseArray,
} from "yahoo-finance2/dist/esm/src/modules/quote";

export const fetchYahooMultipleStock: MultiPriceHandler = async (
  stockTicker: string[]
): Promise<StockCurrentPrice[]> => {
  return new Promise(async (resolve, reject) => {
    const resp: QuoteResponseArray = await yahooFinance.quote(stockTicker);
    if (!resp) {
      reject("Ticker not found in Yahoo finance");
    }
    resolve(
      resp.map((q: Quote) => ({
        stock: q.symbol,
        price: q.regularMarketPrice,
        dailyChange: q.regularMarketChangePercent,
      }))
    );
  });
};
