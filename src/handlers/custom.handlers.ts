import axios from 'axios';
import { PriceHandler, StockCurrentPrice } from './types';

export const fetchPageDataValentum: PriceHandler = async (): Promise<StockCurrentPrice> => {
    try{
        const res = await axios.get('https://www.rankia.com/fondos-de-inversion/valentum-valentum-am');
        const content = res.data
        const idx = content.indexOf("rnk-LiquidationValue_LastSessionValue")
        const priceRaw = content.substring(idx, idx+50)
        const price = priceRaw.substring(priceRaw.indexOf(">")+2, priceRaw.indexOf(" EUR"));
        return ({price: parseFloat(price.replace(',','.')), stock: "Valentum", dailyChange: 0})
    }catch(error){
        throw new Error("Could not fetch the data about Valentum");
    }
}