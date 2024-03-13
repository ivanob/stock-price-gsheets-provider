import { prices } from "../handler";
import { loadUserStocks } from "../utils";
import { stocksFromFinancialTimes, stocksFromYahooFinance } from "./mocks";

jest.mock('../utils');
const mockedLoadUserStocks = jest.mocked(loadUserStocks);

describe("Test on the main handler", () => {
    test("checks if the main handler works with Yahoo Finance stocks", async () => {
      mockedLoadUserStocks.mockReturnValue(Promise.resolve(stocksFromYahooFinance))
      const result = await prices(null)
      console.log(result)
    });
    

    test("checks if the main handler works with Financial times stocks", async () => {
        mockedLoadUserStocks.mockReturnValue(Promise.resolve(stocksFromFinancialTimes))
        const result = await prices(null)
        console.log(result)
      });
  });
  