
export type StockCurrentPrice = {
    price: number,
    stock: string
}

export type PriceHandler = (stockTicker?: string) => Promise<StockCurrentPrice>