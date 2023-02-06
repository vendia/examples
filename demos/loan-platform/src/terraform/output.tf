output "lambda_upb_output" {
  value = aws_lambda_function.upb_lambda.qualified_arn
}

output "lambda_delinquent_output" {
  value = aws_lambda_function.delinquent_lambda.qualified_arn
}

output "lambda_wair_output" {
  value = aws_lambda_function.wair_lambda.qualified_arn
}