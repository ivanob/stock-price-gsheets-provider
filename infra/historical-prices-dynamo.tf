resource "aws_dynamodb_table" "historical-prices" {
  name           = "historical-prices"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  attribute {
    name = "id"
    type = "S"
  }
  tags = {
    Environment = "historical-prices"
  }
}