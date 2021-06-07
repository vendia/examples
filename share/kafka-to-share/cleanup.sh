#!/bin/bash -e

if [[ ${#} != 1 ]]; then
  echo "USAGE: bash ${0} uni-name"
  exit 1
fi

UNI_NAME=${1}

echo "Removing Vendia Share Uni ${UNI_NAME} and Destroying kafka Virtual Machine"
share uni delete --uni ${UNI_NAME} --force &&
    vagrant destroy kafka -f

