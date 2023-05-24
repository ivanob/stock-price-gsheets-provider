import { fetchPageDataValentum } from "../handlers/custom.handlers";

describe("Test on custom scrapers", () => {
  test("checks if the scraper for valentum is working properly", async () => {
    const priceValentum = await fetchPageDataValentum();
    console.log(
      'Price of valentum: ', priceValentum
    )
    expect(priceValentum.price).not.toEqual(-1)
    expect(priceValentum.dailyChange).not.toEqual(-999)
  })
});
