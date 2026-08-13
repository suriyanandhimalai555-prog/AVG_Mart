#!/bin/bash

set -Eeuo pipefail

NAMESPACE="avgmart"

IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse HEAD)}"

BACKEND_IMAGE="ghcr.io/suriyanandhimalai555-prog/avgmart-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="ghcr.io/suriyanandhimalai555-prog/avgmart-frontend:${IMAGE_TAG}"

echo "============================================================"
echo "AVG MART KUBERNETES DEPLOYMENT"
echo "============================================================"
echo "Namespace      : ${NAMESPACE}"
echo "Image Tag      : ${IMAGE_TAG}"
echo "Backend Image  : ${BACKEND_IMAGE}"
echo "Frontend Image : ${FRONTEND_IMAGE}"
echo "============================================================"

ROLLBACK_NEEDED=false

rollback() {
    echo ""
    echo "============================================================"
    echo "DEPLOYMENT FAILED"
    echo "STARTING AUTOMATIC ROLLBACK"
    echo "============================================================"

    if kubectl get deployment avgmart-backend -n "${NAMESPACE}" >/dev/null 2>&1; then
        echo "Rolling back backend..."
        kubectl rollout undo deployment/avgmart-backend \
            -n "${NAMESPACE}" || true

        kubectl rollout status deployment/avgmart-backend \
            -n "${NAMESPACE}" \
            --timeout=120s || true
    fi

    if kubectl get deployment avgmart-frontend -n "${NAMESPACE}" >/dev/null 2>&1; then
        echo "Rolling back frontend..."
        kubectl rollout undo deployment/avgmart-frontend \
            -n "${NAMESPACE}" || true

        kubectl rollout status deployment/avgmart-frontend \
            -n "${NAMESPACE}" \
            --timeout=120s || true
    fi

    echo ""
    echo "============================================================"
    echo "ROLLBACK COMPLETED"
    echo "============================================================"

    kubectl get deployments -n "${NAMESPACE}"
    kubectl get pods -n "${NAMESPACE}"

    exit 1
}

trap rollback ERR

echo "Checking Kubernetes..."
kubectl cluster-info >/dev/null

echo "Kubernetes is reachable."

echo ""
echo "Checking namespace..."
kubectl get namespace "${NAMESPACE}" >/dev/null

echo "Namespace exists."

echo ""
echo "Checking deployments..."

kubectl get deployment avgmart-backend -n "${NAMESPACE}" >/dev/null
kubectl get deployment avgmart-frontend -n "${NAMESPACE}" >/dev/null

echo "Deployments exist."

echo ""
echo "Current backend image:"
kubectl get deployment avgmart-backend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'
echo ""

echo ""
echo "Current frontend image:"
kubectl get deployment avgmart-frontend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'
echo ""

echo ""
echo "============================================================"
echo "UPDATING BACKEND"
echo "============================================================"

kubectl set image deployment/avgmart-backend \
    backend="${BACKEND_IMAGE}" \
    -n "${NAMESPACE}"

echo ""
echo "Waiting for backend rollout..."

kubectl rollout status deployment/avgmart-backend \
    -n "${NAMESPACE}" \
    --timeout=180s

echo "Backend rollout successful."

echo ""
echo "============================================================"
echo "UPDATING FRONTEND"
echo "============================================================"

kubectl set image deployment/avgmart-frontend \
    frontend="${FRONTEND_IMAGE}" \
    -n "${NAMESPACE}"

echo ""
echo "Waiting for frontend rollout..."

kubectl rollout status deployment/avgmart-frontend \
    -n "${NAMESPACE}" \
    --timeout=180s

echo "Frontend rollout successful."

echo ""
echo "============================================================"
echo "CHECKING PODS"
echo "============================================================"

kubectl get pods -n "${NAMESPACE}" -o wide

echo ""
echo "============================================================"
echo "CHECKING DEPLOYMENT STATUS"
echo "============================================================"

BACKEND_READY=$(kubectl get deployment avgmart-backend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.status.readyReplicas}')

BACKEND_DESIRED=$(kubectl get deployment avgmart-backend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.replicas}')

FRONTEND_READY=$(kubectl get deployment avgmart-frontend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.status.readyReplicas}')

FRONTEND_DESIRED=$(kubectl get deployment avgmart-frontend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.replicas}')

echo "Backend  : ${BACKEND_READY:-0}/${BACKEND_DESIRED}"
echo "Frontend : ${FRONTEND_READY:-0}/${FRONTEND_DESIRED}"

if [ "${BACKEND_READY:-0}" != "${BACKEND_DESIRED}" ]; then
    echo "ERROR: Backend is not fully ready."
    exit 1
fi

if [ "${FRONTEND_READY:-0}" != "${FRONTEND_DESIRED}" ]; then
    echo "ERROR: Frontend is not fully ready."
    exit 1
fi

echo ""
echo "============================================================"
echo "CHECKING BACKEND HEALTH"
echo "============================================================"

kubectl run avgmart-health-check \
    -n "${NAMESPACE}" \
    --rm \
    -i \
    --restart=Never \
    --image=curlimages/curl \
    -- \
    curl -fsS http://avgmart-backend:5000/health

echo ""
echo "Backend health check passed."

echo ""
echo "============================================================"
echo "CHECKING PUBLIC API"
echo "============================================================"

curl -fsS https://api.avgmart.com/health

echo ""
echo "Public API health check passed."

echo ""
echo "============================================================"
echo "FINAL DEPLOYMENT STATUS"
echo "============================================================"

kubectl get deployments -n "${NAMESPACE}"

echo ""
kubectl get pods -n "${NAMESPACE}"

echo ""
echo "Backend image:"
kubectl get deployment avgmart-backend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'
echo ""

echo ""
echo "Frontend image:"
kubectl get deployment avgmart-frontend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'
echo ""

echo ""
echo "============================================================"
echo "AVG MART DEPLOYMENT SUCCESSFUL"
echo "============================================================"
echo "Image Tag: ${IMAGE_TAG}"
echo "============================================================"
