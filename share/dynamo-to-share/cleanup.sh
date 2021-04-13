#!/bin/bash

if [[ ${#} < 5 ]]; then
  echo "USAGE: bash ${0} uni-name --profile <AWS IAM profile> --region <AWS REGION>"
  exit 1
fi

STACK_NAME="dynamo-to-share"
UNI_NAME=${1}

while [[ "${#}" -gt 1 ]]; do
  case ${2} in
      "--profile") PROFILE=${3}; shift; shift ;;
      "--region") REGION=${3}; shift ; shift ;;
      *) echo "Unknown parameter: ${2}"; exit 1 ;;
  esac
done


REGION=${REGION:-us-east-1}

echo "Clearing out resources of ${STACK_NAME}..."
echo
TABLE=$(aws cloudformation describe-stack-resource --stack-name ${STACK_NAME} --logical-resource-id InventoryTable --query "StackResourceDetail.PhysicalResourceId" --output text --region ${REGION} --profile ${PROFILE})
echo "Deleting DynamoDB table ${TABLE}..."
aws dynamodb delete-table --table-name ${TABLE} --profile ${PROFILE}
echo

echo "Deleting CloudFormation stack..." && aws cloudformation delete-stack \
  --stack-name ${STACK_NAME} --region ${REGION} --profile ${PROFILE}

echo "Clearing out CloudWatch Log Groups..." && for LOG_GROUP in $(aws logs describe-log-groups --log-group-name-prefix '/aws/lambda/dynamo-to-share-' --query "logGroups[*].logGroupName" --output text --region ${REGION} --profile ${PROFILE}); do
  echo "Removing log group ${LOG_GROUP}..."
  aws logs delete-log-group --log-group-name ${LOG_GROUP} --region ${REGION} --profile ${PROFILE}
  echo
done

echo "Removing Vendia Share uni ${UNI_NAME}"
share uni delete --uni ${UNI_NAME} --force
