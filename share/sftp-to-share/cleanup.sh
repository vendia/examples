#!/bin/bash -e

if [[ ${#} < 5 ]]; then
  echo "USAGE: bash ${0} uni-name --profile <AWS IAM profile> --region <AWS REGION>"
  exit 1
fi

STACK_NAME="sftp-to-share"
UNI_NAME=${1}

while [[ "${#}" -gt 1 ]]; do
  case ${2} in
      "--profile") PROFILE=${3}; shift; shift ;;
      "--region") REGION=${3}; shift ; shift ;;
      *) echo "Unknown parameter: ${2}"; exit 1 ;;
  esac
done


REGION=${REGION:-us-east-1}

BUCKET=$(aws cloudformation describe-stack-resource --stack-name ${STACK_NAME} --logical-resource-id SftpBucket --query "StackResourceDetail.PhysicalResourceId" --output text --region ${REGION} --profile ${PROFILE})
echo "Clearing out S3 SFTP bucket ${BUCKET}..."
aws s3 rm s3://${BUCKET} --recursive --profile ${PROFILE}

echo "Deleting CloudFormation stack..." && aws cloudformation delete-stack \
  --stack-name ${STACK_NAME} --region ${REGION} --profile ${PROFILE}

echo "Removing Vendia Share uni ${UNI_NAME}"
share uni delete --uni ${UNI_NAME} --force
