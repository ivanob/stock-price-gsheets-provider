import {fetchYahooSingleStock} from '../handlers/yahoo.finance.handler'
import {StockCurrentPrice} from '../handlers/types'

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
