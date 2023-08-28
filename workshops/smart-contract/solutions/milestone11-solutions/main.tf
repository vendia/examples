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
  region  = "us-east-1"
}

resource "aws_iam_role" "smart-contract-role" {
  name = "smart-contract-role"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.smart-contract-role.name
}

resource "aws_lambda_function" "hello-world-terraform" {
  # (resource arguments)
  filename      = "./index.mjs.zip"
  function_name = "hello-world-terraform"
  handler       = "index.handler"
  role          = aws_iam_role.smart-contract-role.arn
  publish       = true

  source_code_hash = filebase64sha256("./index.mjs.zip")

  runtime = "nodejs18.x"

  # Leaving environment section for potential future use
  environment {
    variables = {
      foo = "bar"
    }
  }

}