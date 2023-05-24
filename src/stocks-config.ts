import { fetchPageDataValentum } from "./handlers/custom.handlers";
import { PriceHandler } from "./handlers/types";
import { fetchYahooSingleStock } from "./handlers/yahoo.finance.handler";

const MAX_ALLOWED_INTERVAL = 6 * 60 * 60 * 1000; //Interval each 6h

const hoursToMiliseconds = (hours: number): number => {
    return hours * 60 * 60 * 1000;
}

// This file is likely to be moved into a DB
export type StockQuery = {
    ticker: string,
    periodicity: number,
    handler: PriceHandler
}

export const queries: StockQuery[] = [
    // {
    //     ticker: 'KRI.AT',
    //     periodicity: hoursToMiliseconds(6),
    //     handler: () => fetchYahooSingleStock('KRI.AT')
    // },
    // {
    //     ticker: 'IWDA.AS',
    //     periodicity: hoursToMiliseconds(6),
    //     handler: () => fetchYahooSingleStock('IWDA.AS')
    // },
    {
        ticker: 'Valentum',
        periodicity: 1,
        handler: fetchPageDataValentum
    },
    // {
    //     ticker: 'VUSA.AS',
    //     periodicity: hoursToMiliseconds(6),
    //     handler: () => fetchYahooSingleStock('VUSA.AS')
    // },
    // {
    //     ticker: 'EMIM.AS',
    //     periodicity: hoursToMiliseconds(6),
    //     handler: () => fetchYahooSingleStock('EMIM.AS')
    // },
    // {
    //     ticker: 'NQSE.DE',
    //     periodicity: hoursToMiliseconds(6),
    //     handler: () => fetchYahooSingleStock('NQSE.DE')
    // }
]