import {fetchYahooSingleStock} from '../src/handlers/yahoo.finance.handler'
import {StockCurrentPrice} from '../src/handlers/types'

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Event handlers', () => {
  describe('#yahoo.finance.handler', () => {
    it('It should save the event in DB', async () => {
      const handler: StockCurrentPrice = await fetchYahooSingleStock('EMIM.AS');
      console.log(handler)
    });
  });
});
