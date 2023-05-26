
export type StockCurrentPrice = {
    price: number,
    stock: string,
    dailyChange: number
}

export type ConfigUser = {
    user: string,
    wallet: StockConfig[]
}

export type StockConfig = {
    ticker: string,
    description: string,
    type: string
}

export type SinglePriceHandler = (stockTicker?: string) => Promise<StockCurrentPrice>
export type MultiPriceHandler = (stockTicker?: string[]) => Promise<StockCurrentPrice[]>