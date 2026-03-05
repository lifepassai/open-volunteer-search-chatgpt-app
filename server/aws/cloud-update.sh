#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

set -a
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

FUNCTION_NAME="${StackName}-${STAGE}-lambda"

echo "Building function.zip..."
./zip-function.sh

echo "Updating Lambda ${FUNCTION_NAME}..."
aws lambda update-function-code \
  --function-name "${FUNCTION_NAME}" \
  --zip-file "fileb://function.zip"

echo "Done. Lambda is updating (allow a few seconds before it serves new code)."
