resource "aws_iam_role" "iam_for_lambda" {
  name               = "lambda_prices"
  assume_role_policy = data.aws_iam_policy_document.policy_execute_lambda_prices.json

  # This inline_policy is for attaching to the lambda the permissions to interact with DB
  inline_policy {
    name   = "policy-dynamodb-writer"
    policy = data.aws_iam_policy_document.inline_policy.json
  }
}

# This block is the definiton of the lambda itself
resource "aws_lambda_function" "lambda_prices" {
  filename         = data.archive_file.zip.output_path
  function_name    = "prices"
  handler          = "handler.prices"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.iam_for_lambda.arn
  memory_size      = 128
  timeout          = 30 # I increaded in 15 seconds the timeout cause YahooFinance takes time to fetch the Cookie
  source_code_hash = data.archive_file.zip.output_base64sha256
  environment {
    variables = {
      AWS_ACCOUNT_ID = var.aws_account_id #This variable is needed in the code of the lambda function to 
      # point at the SQS resource, so I get it from the variables and pass it so can be used by: process.env.AWS_ACCOUNT_ID,
      # the AWS_REGION is automatically filled so its available for me without defining it explicitly
    }
  }
}

# This data block packs the lambda source code into a zip
data "archive_file" "zip" {
  type        = "zip"
  source_file = "../dist/handler.js"
  output_path = "../dist/handler.zip"
}

data "aws_iam_policy_document" "policy_execute_lambda_prices" {
  statement {
    sid    = ""
    effect = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
    actions = ["sts:AssumeRole"]
  }
}

# I create a cloudwatch log group to allow logging on this lambda
resource "aws_cloudwatch_log_group" "function_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_prices.function_name}"
  retention_in_days = 3
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_iam_role_policy_attachment" "function_logging_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.function_logging_policy.arn
}

data "aws_iam_policy_document" "inline_policy" {
  statement {
    actions = [
      "dynamodb:DeleteItem",
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:ListTables",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:UpdateTable",
    ]

    resources = [aws_dynamodb_table.config-users-prices.arn]

    effect = "Allow"
  }
}
resource "aws_iam_policy" "function_logging_policy" {
  name   = "function-logging-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect : "Allow",
        Resource : "arn:aws:logs:*:*:*"
      }
    ]
  })
}