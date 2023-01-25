terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = var.aws_region
}

# Permission needed for smart contract
resource "aws_lambda_permission" "allow_vendia_smart_contract_invoke" {
  statement_id  = "AllowVendiaInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.test_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.test_lambda.version
}

# Permission needed for smart contract
resource "aws_lambda_permission" "allow_vendia_smart_contract_get_config" {
  statement_id  = "AllowVendiaGetFunctionConfiguration"
  action        = "lambda:GetFunctionConfiguration"
  function_name = aws_lambda_function.test_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.test_lambda.version
}

# get basic role policy from a local file. If you have to change policy, change it in the file.
data "local_file" "lambda_role" {
  filename = "./lambda-role.json"
}

# Creating an iam role to assign to the lambda
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy =  data.local_file.lambda_role.content
}

# Creating an lambda function.
resource "aws_lambda_function" "test_lambda" {
  # (resource arguments)
  filename      = "./lambda-code/<your-lambda-zip-file>"
  function_name = "<your-lambda-function-name>"
  handler       = "validation.handler"
  role          = aws_iam_role.iam_for_lambda.arn
  publish       = true

  source_code_hash = filebase64sha256("<your-lambda-zip-file>")

  runtime = "nodejs16.x"

  # Leaving environment section for potential future use
  environment {
    variables = {
      foo = "bar"
    }
  }

}


