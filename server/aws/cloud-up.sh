#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

set -a
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"
: "${WwwPath:?Set WwwPath in cloud.env}"

STACK_NAME="${StackName}-${STAGE}"

echo "Deploying stack ${STACK_NAME}..."
aws cloudformation deploy \
  --template-file cloud-formation.yaml \
  --stack-name "${StackName}-${STAGE}" \
  --parameter-overrides \
    StackName="${StackName}" \
    Stage="${STAGE}" \
    NodeEnv="${NodeEnv:-production}" \
    WwwPath="${WwwPath}" \
    LogLevel="${LogLevel:-info}" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

node write-formation-results.js --stage=${STAGE}
