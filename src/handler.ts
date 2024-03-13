import { fetchFinancialTimesStock } from "./fetchers/financial-times-fetch";
import { StockConfig, StockCurrentPrice } from "./fetchers/types";
import { fetchYahooMultipleStock } from "./fetchers/yahoo-finance-fetch";
import {
  loadUserStocks,
} from "./utils";

export const prices = async (event: any) => {
  const wallet: StockConfig[] = await loadUserStocks('11111');
  // const walletYahoo = wallet.filter(stock => stock.fetcher==='yahoo.finance')
  // const tickers = walletYahoo.map((stock: StockConfig) => stock.ticker);
  let dataFromYahoo = Promise.resolve([])
  // if(walletYahoo.length > 0){
  //   dataFromYahoo = fetchYahooMultipleStock(tickers)
  // }
  const walletFinancialTimes = wallet.filter(stock => stock.fetcher==='financial.times')
  const dataFromFinancialTimes = walletFinancialTimes.map(stock => fetchFinancialTimesStock(stock.ticker))
  const res = await Promise.allSettled([dataFromYahoo, ...dataFromFinancialTimes])
  const fulfilled = res.filter(price => price.status === 'fulfilled') as unknown as PromiseFulfilledResult<StockCurrentPrice[]>[]
  const [first, ...rest] = fulfilled;
  const response = [...first.value, ...rest.map(s => s.value)] as StockCurrentPrice[]
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
};
