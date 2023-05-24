import axios from "axios";
import { PriceHandler, StockCurrentPrice } from "./types";
import * as cheerio from "cheerio";

export const fetchPageDataValentum: PriceHandler =
  async (): Promise<StockCurrentPrice> => {
    try {
      const res = await axios.get(
        "https://www.rankia.com/fondos-de-inversion/valentum-valentum-am"
      );
      const $ = cheerio.load(res.data);
      const result: StockCurrentPrice = {
        price: -1,
        stock: "Valentum",
        dailyChange: -999,
      };
      $("td").each((index, element) => {
        const price = $(element)
          .find("span.gc-CotizationCard_LastSessionValue")
          .text();
        if (price && result.price === -1) {
          result.price = parseFloat(price.split(" ")[0].replace(",", "."));
        }
        const dailyChange = $(element)
          .find("span.gc-CotizationCard_Evolution-positive")
          .text();
        if (dailyChange && result.dailyChange === -999) {
          result.dailyChange = parseFloat(dailyChange.split("%")[0].replace(",", "."));
        }
      });
      return result;
    } catch (error) {
      throw new Error("Could not fetch the data about Valentum");
    }
  };
