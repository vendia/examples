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

# Permission needed for upb smart contract
resource "aws_lambda_permission" "upb_allow_vendia_smart_contract_invoke" {
  statement_id  = "AllowVendiaInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upb_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.upb_lambda.version
}

resource "aws_lambda_permission" "upb_allow_vendia_smart_contract_get_config" {
  statement_id  = "AllowVendiaGetFunctionConfiguration"
  action        = "lambda:GetFunctionConfiguration"
  function_name = aws_lambda_function.upb_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.upb_lambda.version
}

# Permission needed for delinquent smart contract
resource "aws_lambda_permission" "delinquent_allow_vendia_smart_contract_invoke" {
  statement_id  = "AllowVendiaInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delinquent_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.delinquent_lambda.version
}

resource "aws_lambda_permission" "delinquent_allow_vendia_smart_contract_get_config" {
  statement_id  = "AllowVendiaGetFunctionConfiguration"
  action        = "lambda:GetFunctionConfiguration"
  function_name = aws_lambda_function.delinquent_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.delinquent_lambda.version
}

# Permission needed for wair smart contract
resource "aws_lambda_permission" "wair_allow_vendia_smart_contract_invoke" {
  statement_id  = "AllowVendiaInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wair_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.wair_lambda.version
}

resource "aws_lambda_permission" "wair_allow_vendia_smart_contract_get_config" {
  statement_id  = "AllowVendiaGetFunctionConfiguration"
  action        = "lambda:GetFunctionConfiguration"
  function_name = aws_lambda_function.wair_lambda.function_name
  principal     = "<vendia-smart-contract-arn>"
  qualifier     = aws_lambda_function.wair_lambda.version
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

# Creating an upb lambda function.
resource "aws_lambda_function" "upb_lambda" {
  # (resource arguments)
  filename      = "../src/upb/index.js.zip"
  function_name = "vendia-upb-lambda-terraform"
  handler       = "index.handler"
  role          = aws_iam_role.iam_for_lambda.arn
  publish       = true

  source_code_hash = filebase64sha256("../src/upb/index.js.zip")

  runtime = "nodejs16.x"

  # Leaving environment section for potential future use
  environment {
    variables = {
      foo = "bar"
    }
  }

}

# Creating an delinquent lambda function.
resource "aws_lambda_function" "delinquent_lambda" {
  # (resource arguments)
  filename      = "../src/delinquent/index.js.zip"
  function_name = "vendia-delinquent-lambda-terraform"
  handler       = "index.handler"
  role          = aws_iam_role.iam_for_lambda.arn
  publish       = true

  source_code_hash = filebase64sha256("../src/delinquent/index.js.zip")

  runtime = "nodejs16.x"

  # Leaving environment section for potential future use
  environment {
    variables = {
      foo = "bar"
    }
  }

}

# Creating an wair lambda function.
resource "aws_lambda_function" "wair_lambda" {
  # (resource arguments)
  filename      = "../src/wair/index.js.zip"
  function_name = "vendia-wair-lambda-terraform"
  handler       = "index.handler"
  role          = aws_iam_role.iam_for_lambda.arn
  publish       = true

  source_code_hash = filebase64sha256("../src/wair/index.js.zip")

  runtime = "nodejs16.x"

  # Leaving environment section for potential future use
  environment {
    variables = {
      foo = "bar"
    }
  }

}