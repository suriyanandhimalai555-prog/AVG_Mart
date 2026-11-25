#!/bin/bash

set -e

NAMESPACE="avgmart"

IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse HEAD)}"

BACKEND_IMAGE="ghcr.io/suriyanandhimalai555-prog/avgmart-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="ghcr.io/suriyanandhimalai555-prog/avgmart-frontend:${IMAGE_TAG}"

echo "AVG Mart Kubernetes Deployment"
echo "Namespace: ${NAMESPACE}"
echo "Image Tag: ${IMAGE_TAG}"
echo "Backend Image: ${BACKEND_IMAGE}"
echo "Frontend Image: ${FRONTEND_IMAGE}"

rollback() {
    echo "Deployment failed"
    echo "Starting rollback..."

    kubectl rollout undo deployment/avgmart-backend \
        -n "${NAMESPACE}" || true

    kubectl rollout undo deployment/avgmart-frontend \
        -n "${NAMESPACE}" || true

    echo "Rollback completed"
    exit 1
}

trap rollback ERR

echo "Applying Kubernetes manifests..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/backend-hpa.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml

echo "Updating backend image..."

kubectl set image deployment/avgmart-backend \
    backend="${BACKEND_IMAGE}" \
    -n "${NAMESPACE}"

echo "Updating frontend image..."

kubectl set image deployment/avgmart-frontend \
    frontend="${FRONTEND_IMAGE}" \
    -n "${NAMESPACE}"

echo "Checking backend rollout..."

kubectl rollout status deployment/avgmart-backend \
    -n "${NAMESPACE}" \
    --timeout=180s

echo "Checking frontend rollout..."

kubectl rollout status deployment/avgmart-frontend \
    -n "${NAMESPACE}" \
    --timeout=180s

echo "Checking backend image..."

kubectl get deployment avgmart-backend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'

echo

echo "Checking frontend image..."

kubectl get deployment avgmart-frontend \
    -n "${NAMESPACE}" \
    -o jsonpath='{.spec.template.spec.containers[0].image}'

echo

echo "Checking deployments..."

kubectl get deployments -n "${NAMESPACE}"

echo "Checking pods..."

kubectl get pods -n "${NAMESPACE}"

echo "Checking services..."

kubectl get svc -n "${NAMESPACE}"

echo "AVG Mart deployment successful"
