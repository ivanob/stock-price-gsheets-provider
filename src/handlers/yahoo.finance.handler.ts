import { PriceHandler, StockCurrentPrice } from "./types";
import axios, { AxiosRequestConfig } from 'axios';

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export const fetchSingleStock: PriceHandler = async (stockTicker: string): Promise<StockCurrentPrice> => {
    const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile',
        params: {symbol: stockTicker, region: 'US'},
        headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
        }
    }
    try{
        const res: any = await axios.request(options);
        if (res.statusCode < 200 || res.statusCode >= 300) {
            throw new Error('statusCode=' + res.statusCode);
        }
        return ({stock: stockTicker, price: res.data.price.regularMarketPrice.raw});
    }catch(error){
        throw error;
    }
}