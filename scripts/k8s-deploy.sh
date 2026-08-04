#!/bin/bash

set -e

NAMESPACE="avgmart"

echo "Deploying AVG_Mart..."

kubectl apply -f ../k8s/namespace.yaml

kubectl apply -f ../k8s/

echo "Waiting for backend rollout..."

if ! kubectl rollout status deployment/avgmart-backend \
-n $NAMESPACE \
--timeout=120s
then
    echo "Backend failed. Rolling back..."
    kubectl rollout undo deployment/avgmart-backend -n $NAMESPACE
    exit 1
fi


echo "Waiting for frontend rollout..."

if ! kubectl rollout status deployment/avgmart-frontend \
-n $NAMESPACE \
--timeout=120s
then
    echo "Frontend failed. Rolling back..."
    kubectl rollout undo deployment/avgmart-frontend -n $NAMESPACE
    exit 1
fi


echo "AVG_Mart deployment successful"
