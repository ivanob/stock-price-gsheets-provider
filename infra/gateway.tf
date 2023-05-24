# Define the API Gateway resource
resource "aws_api_gateway_rest_api" "api_to_lambda_stock_prices" {
  name        = "api_to_lambda_stock_prices"
  description = "API to call the stock prices lambda"
}

# Define resources and methods
resource "aws_api_gateway_resource" "resource_stock_prices" {
  rest_api_id = aws_api_gateway_rest_api.api_to_lambda_stock_prices.id
  parent_id   = aws_api_gateway_rest_api.api_to_lambda_stock_prices.root_resource_id
  path_part   = "{${var.resource_stock_prices}+}"
}

# Define the methods for each resource (entity)
resource "aws_api_gateway_method" "method_get_prices" {
  rest_api_id   = aws_api_gateway_rest_api.api_to_lambda_stock_prices.id
  resource_id   = aws_api_gateway_resource.resource_stock_prices.id
  http_method   = "GET"
  authorization = "NONE"
}

# Define integration and deployment for each method
resource "aws_api_gateway_integration" "integration_api_gateway_get_stock_prices" {
  rest_api_id             = aws_api_gateway_rest_api.api_to_lambda_stock_prices.id
  resource_id             = aws_api_gateway_resource.resource_stock_prices.id
  http_method             = aws_api_gateway_method.method_get_prices.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_prices.invoke_arn
}

resource "aws_api_gateway_deployment" "gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api_to_lambda_stock_prices.id
  stage_name  = "prod"
  depends_on = [
    aws_api_gateway_method.method_get_prices,
    aws_api_gateway_integration.integration_api_gateway_get_stock_prices,
  ]
}

# Permissions to execute the lambda from the gateway
resource "aws_lambda_permission" "permissions_execute_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_prices.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api_to_lambda_stock_prices.execution_arn}/*/*/*"
  depends_on = [
    "aws_lambda_function.lambda_prices",
    "aws_api_gateway_rest_api.api_to_lambda_stock_prices",
    "aws_api_gateway_resource.resource_stock_prices"
  ]
}