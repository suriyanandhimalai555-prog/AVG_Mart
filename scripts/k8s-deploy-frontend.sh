#!/bin/bash

set -Eeuo pipefail

NAMESPACE="avgmart"
DEPLOYMENT="avgmart-frontend"
CONTAINER="frontend"

IMAGE_TAG="${IMAGE_TAG:?IMAGE_TAG is required}"
IMAGE="ghcr.io/suriyanandhimalai555-prog/avgmart-frontend:${IMAGE_TAG}"

UPDATE_STARTED=0

echo "======================================"
echo "AVG Mart Frontend-Only Deployment"
echo "Namespace: ${NAMESPACE}"
echo "Image: ${IMAGE}"
echo "======================================"

rollback() {
    local exit_code=$?
    trap - ERR

    echo "Frontend deployment failed."

    if [[ "${UPDATE_STARTED}" -eq 1 ]]; then
        echo "Rolling back frontend only..."

        if kubectl rollout undo "deployment/${DEPLOYMENT}" \
            -n "${NAMESPACE}"; then

            echo "Waiting for frontend rollback..."
            kubectl rollout status "deployment/${DEPLOYMENT}" \
                -n "${NAMESPACE}" \
                --timeout=180s || \
                echo "WARNING: Rollback rollout did not complete successfully."
        else
            echo "WARNING: Frontend rollback command failed."
        fi
    else
        echo "No successful image update occurred; rollback not required."
    fi

    exit "${exit_code}"
}

trap rollback ERR

echo "Checking frontend deployment..."
kubectl get deployment "${DEPLOYMENT}" -n "${NAMESPACE}"

echo "Updating frontend image..."
kubectl set image "deployment/${DEPLOYMENT}" \
    "${CONTAINER}=${IMAGE}" \
    -n "${NAMESPACE}"

UPDATE_STARTED=1

echo "Waiting for frontend rollout..."
kubectl rollout status "deployment/${DEPLOYMENT}" \
    -n "${NAMESPACE}" \
    --timeout=180s

echo "Verifying deployed frontend image..."

ACTUAL_IMAGE=$(kubectl get deployment "${DEPLOYMENT}" \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[?(@.name=="frontend")].image}')

echo "Expected: ${IMAGE}"
echo "Actual:   ${ACTUAL_IMAGE}"

if [[ "${ACTUAL_IMAGE}" != "${IMAGE}" ]]; then
    echo "ERROR: Deployed image does not match the requested image."
    false
fi

trap - ERR

echo "Frontend deployment successful."
