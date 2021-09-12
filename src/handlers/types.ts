
export type StockCurrentPrice = {
    price: number,
    stock: string,
    dailyChange: number
}

export type PriceHandler = (stockTicker?: string) => Promise<StockCurrentPrice>