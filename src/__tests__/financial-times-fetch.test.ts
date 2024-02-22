import { fetchFinancialTimesStock } from "../fetchers/financial-times-fetch";

describe("Test on financial-times fetcher", () => {
    test("checks if the financial-times fetcher is working properly using 4Mass", async () => {
        const stockInfo = await fetchFinancialTimesStock("4MS:WSE");
        expect(stockInfo.stock).toEqual("4MS:WSE")
        expect(stockInfo.price).toBeGreaterThan(0);
    });

    test("checks if the financial-times fetcher is working properly using KTIMAS", async () => {
        const stockInfo = await fetchFinancialTimesStock("KTILA:ATH");
        expect(stockInfo.stock).toEqual("KTILA:ATH")
        expect(stockInfo.price).toBeGreaterThan(0);
    });
});