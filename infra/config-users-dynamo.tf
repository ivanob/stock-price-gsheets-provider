resource "aws_dynamodb_table" "config-users-prices" {
  name         = "config-users-prices"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  tags = {
    Environment = "config-users-prices"
  }
}

// I will populate the table with some pre-set data
resource "aws_dynamodb_table_item" "item1_config_user" {
  table_name = aws_dynamodb_table.config-users-prices.name
  hash_key   = aws_dynamodb_table.config-users-prices.hash_key
  item       = <<ITEM
  {
    "id": {"S": "1"},
    "user": {"S": "11111"},
    "wallet": {
      "L": [
         {"M": {
          "ticker": {"S": "0P000125T9.F"},
          "description": {"S": "Valentum FI"},
          "type": {"S": "Investment fund"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
         {"M": {
          "ticker": {"S": "KRI.AT"},
          "description": {"S": "KriKri Milk"},
          "type": {"S": "stock"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
         {"M": {
          "ticker": {"S": "IWDA.AS"},
          "description": {"S": "iShares Core MSCI World UCITS ETF USD (Acc)"},
          "type": {"S": "ETF"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
         {"M": {
          "ticker": {"S": "VUSA.AS"},
          "description": {"S": "Vanguard S&P 500 UCITS ETF (VUSA.AS)"},
          "type": {"S": "ETF"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
         {"M": {
          "ticker": {"S": "EMIM.AS"},
          "description": {"S": "iShares Core MSCI EM IMI UCITS ETF (EMIM.AS)"},
          "type": {"S": "ETF"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
         {"M": {
          "ticker": {"S": "NQSE.DE"},
          "description": {"S": "iShares VII PLC - iShares NASDAQ 100 UCITS ETF (NQSE.DE)"},
          "type": {"S": "ETF"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
          {"M": {
          "ticker": {"S": "0P0001NSL4.F"},
          "description": {"S": "True Value Compounders B FI (0P0001NSL4.F)"},
          "type": {"S": "Investment fund"},
          "fetcher": {"S": "yahoo.finance"}
         }
         },
          {"M": {
          "ticker": {"S": "4MS:WSE"},
          "description": {"S": "4Mass"},
          "type": {"S": "stock"},
          "fetcher": {"S": "financial.times"}
         }
         },
         {"M": {
          "ticker": {"S": "KTILA:ATH"},
          "description": {"S": "Kostas Lazaridis"},
          "type": {"S": "stock"},
          "fetcher": {"S": "financial.times"}
         }
         },
         {"M": {
          "ticker": {"S": "ETX:WSE"},
          "description": {"S": "Euro-tax"},
          "type": {"S": "stock"},
          "fetcher": {"S": "financial.times"}
         }
         },
         {"M": {
          "ticker": {"S": "NZK:ASX"},
          "description": {"S": "New Zealand King salmnon"},
          "type": {"S": "stock"},
          "fetcher": {"S": "financial.times"}
         }
         },
         {"M": {
          "ticker": {"S": "KARE:ATH"},
          "description": {"S": "Karelia Tobacco"},
          "type": {"S": "stock"},
          "fetcher": {"S": "financial.times"}
         }
         }
      ]
    }
  }
  ITEM
}
