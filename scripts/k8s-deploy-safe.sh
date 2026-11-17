#!/usr/bin/env bash

set -euo pipefail

NAMESPACE="avgmart"

BACKEND_DEPLOYMENT="avgmart-backend"
FRONTEND_DEPLOYMENT="avgmart-frontend"

BACKEND_CONTAINER="backend"
FRONTEND_CONTAINER="frontend"

REGISTRY="ghcr.io/suriyanandhimalai555-prog"

IMAGE_TAG="${IMAGE_TAG:?ERROR: IMAGE_TAG is required}"

if [[ ! "${IMAGE_TAG}" =~ ^[A-Za-z0-9_.-]+$ ]]; then
    echo "ERROR: Invalid IMAGE_TAG."
    exit 1
fi

BACKEND_IMAGE="${REGISTRY}/avgmart-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="${REGISTRY}/avgmart-frontend:${IMAGE_TAG}"

BACKEND_UPDATED=0
FRONTEND_UPDATED=0
ROLLBACK_RUNNING=0
ROLLBACK_FAILED=0

get_image() {
    local deployment="$1"
    local container="$2"

    kubectl get deployment "${deployment}" \
        -n "${NAMESPACE}" \
        -o "jsonpath={.spec.template.spec.containers[?(@.name==\"${container}\")].image}"
}

verify_image() {
    local deployment="$1"
    local container="$2"
    local expected="$3"
    local actual

    actual="$(get_image "${deployment}" "${container}")"

    echo "Expected image: ${expected}"
    echo "Actual image:   ${actual}"

    if [[ "${actual}" != "${expected}" ]]; then
        echo "ERROR: Image verification failed for ${deployment}."
        return 1
    fi
}

validate_health() {
    local response="$1"

    if ! jq -e '.success == true and .status == "healthy"' >/dev/null <<< "$response"; then
        echo "ERROR: Backend health response is not valid healthy JSON."
        return 1
    fi

    echo "Backend health response validated."
}

rollback() {
    local exit_code=$?

    if [[ "${ROLLBACK_RUNNING}" -eq 1 ]]; then
        exit "${exit_code}"
    fi

    ROLLBACK_RUNNING=1
    trap - ERR

    echo
    echo "=========================================="
    echo "DEPLOYMENT FAILED — STARTING ROLLBACK"
    echo "=========================================="

    if [[ "${FRONTEND_UPDATED}" -eq 1 ]]; then
        echo "Restoring previous frontend image..."

        if kubectl set image \
            "deployment/${FRONTEND_DEPLOYMENT}" \
            "${FRONTEND_CONTAINER}=${OLD_FRONTEND_IMAGE}" \
            -n "${NAMESPACE}" &&
           kubectl rollout status \
            "deployment/${FRONTEND_DEPLOYMENT}" \
            -n "${NAMESPACE}" \
            --timeout=180s &&
           verify_image "${FRONTEND_DEPLOYMENT}" \
            "${FRONTEND_CONTAINER}" "${OLD_FRONTEND_IMAGE}"; then
            echo "Frontend rollback completed and verified."
        else
            echo "CRITICAL: Frontend rollback failed verification."
            ROLLBACK_FAILED=1
        fi
    fi

    if [[ "${BACKEND_UPDATED}" -eq 1 ]]; then
        echo "Restoring previous backend image..."

        if kubectl set image \
            "deployment/${BACKEND_DEPLOYMENT}" \
            "${BACKEND_CONTAINER}=${OLD_BACKEND_IMAGE}" \
            -n "${NAMESPACE}" &&
           kubectl rollout status \
            "deployment/${BACKEND_DEPLOYMENT}" \
            -n "${NAMESPACE}" \
            --timeout=180s &&
           verify_image "${BACKEND_DEPLOYMENT}" \
            "${BACKEND_CONTAINER}" "${OLD_BACKEND_IMAGE}"; then
            echo "Backend rollback completed and verified."
        else
            echo "CRITICAL: Backend rollback failed verification."
            ROLLBACK_FAILED=1
        fi
    fi

    if [[ "${ROLLBACK_FAILED}" -eq 1 ]]; then
        echo "CRITICAL: MANUAL PRODUCTION VERIFICATION REQUIRED."
    else
        echo "Rollback completed and previous images verified."
    fi

    exit "${exit_code}"
}

trap rollback ERR

echo "=========================================="
echo "AVG MART SAFE KUBERNETES DEPLOYMENT"
echo "=========================================="
echo "Namespace: ${NAMESPACE}"
echo "Image tag: ${IMAGE_TAG}"
echo "Backend:   ${BACKEND_IMAGE}"
echo "Frontend:  ${FRONTEND_IMAGE}"
echo "=========================================="

echo
echo "===== PRE-DEPLOYMENT VALIDATION ====="

kubectl get namespace "${NAMESPACE}"

kubectl get deployment "${BACKEND_DEPLOYMENT}" -n "${NAMESPACE}"
kubectl get deployment "${FRONTEND_DEPLOYMENT}" -n "${NAMESPACE}"

OLD_BACKEND_IMAGE="$(get_image "${BACKEND_DEPLOYMENT}" "${BACKEND_CONTAINER}")"
OLD_FRONTEND_IMAGE="$(get_image "${FRONTEND_DEPLOYMENT}" "${FRONTEND_CONTAINER}")"

if [[ -z "${OLD_BACKEND_IMAGE}" || -z "${OLD_FRONTEND_IMAGE}" ]]; then
    echo "ERROR: Could not identify both currently deployed images."
    false
fi

echo "Previous backend: ${OLD_BACKEND_IMAGE}"
echo "Previous frontend: ${OLD_FRONTEND_IMAGE}"

echo
echo "===== DEPLOY BACKEND ====="

if [[ "${OLD_BACKEND_IMAGE}" != "${BACKEND_IMAGE}" ]]; then
    kubectl set image \
        "deployment/${BACKEND_DEPLOYMENT}" \
        "${BACKEND_CONTAINER}=${BACKEND_IMAGE}" \
        -n "${NAMESPACE}"

    BACKEND_UPDATED=1

    kubectl rollout status \
        "deployment/${BACKEND_DEPLOYMENT}" \
        -n "${NAMESPACE}" \
        --timeout=180s
else
    echo "Backend already uses the requested image."
fi

verify_image "${BACKEND_DEPLOYMENT}" \
    "${BACKEND_CONTAINER}" "${BACKEND_IMAGE}"

echo
echo "===== BACKEND HEALTH CHECK ====="

HEALTH_RESPONSE="$(kubectl exec \
    -n "${NAMESPACE}" \
    "deployment/${BACKEND_DEPLOYMENT}" \
    -- wget -qO- http://127.0.0.1:5000/health)"

echo "${HEALTH_RESPONSE}"

validate_health "${HEALTH_RESPONSE}"

echo
echo "===== DEPLOY FRONTEND ====="

if [[ "${OLD_FRONTEND_IMAGE}" != "${FRONTEND_IMAGE}" ]]; then
    kubectl set image \
        "deployment/${FRONTEND_DEPLOYMENT}" \
        "${FRONTEND_CONTAINER}=${FRONTEND_IMAGE}" \
        -n "${NAMESPACE}"

    FRONTEND_UPDATED=1

    kubectl rollout status \
        "deployment/${FRONTEND_DEPLOYMENT}" \
        -n "${NAMESPACE}" \
        --timeout=180s
else
    echo "Frontend already uses the requested image."
fi

verify_image "${FRONTEND_DEPLOYMENT}" \
    "${FRONTEND_CONTAINER}" "${FRONTEND_IMAGE}"

echo
echo "===== FINAL DEPLOYMENT STATUS ====="

kubectl get deployments -n "${NAMESPACE}"
kubectl get pods -n "${NAMESPACE}"

echo
echo "=========================================="
echo "AVG MART DEPLOYMENT SUCCESSFUL"
echo "=========================================="

trap - ERR
