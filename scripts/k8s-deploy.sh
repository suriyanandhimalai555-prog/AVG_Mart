#!/bin/bash

set -e

NAMESPACE="avgmart"

echo "================================"
echo "Deploying AVG_Mart Kubernetes"
echo "================================"


rollback()
{
    echo "================================"
    echo "Deployment failed"
    echo "Starting rollback..."
    echo "================================"

    kubectl rollout undo deployment/avgmart-backend \
    -n $NAMESPACE || true

    kubectl rollout undo deployment/avgmart-frontend \
    -n $NAMESPACE || true


    echo "Rollback completed"

    exit 1
}


trap rollback ERR


echo "Applying Kubernetes manifests..."

kubectl apply -f k8s/namespace.yaml

kubectl apply -f k8s/


echo "Checking backend rollout..."

kubectl rollout status deployment/avgmart-backend \
-n $NAMESPACE \
--timeout=120s


echo "Checking frontend rollout..."

kubectl rollout status deployment/avgmart-frontend \
-n $NAMESPACE \
--timeout=120s


echo "Checking pods..."

kubectl get pods -n $NAMESPACE


echo "================================"
echo "AVG_Mart deployment successful"
echo "================================"
