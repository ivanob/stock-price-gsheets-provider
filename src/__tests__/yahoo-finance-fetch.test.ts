import { fetchYahooMultipleStock } from "../fetchers/yahoo-finance-fetch";

describe("Test on yahoo fetcher", () => {
  test("checks if the yahoo fetcher is working properly", async () => {
    const stocks = await fetchYahooMultipleStock(["AAPL", "NFLX"]);
    expect(stocks[0].price).not.toBe(0)
    expect(stocks[1].price).not.toBe(0)
    expect(stocks[0].dailyChange).not.toBe(0)
    expect(stocks[1].dailyChange).not.toBe(0)
  });
});
