#!/bin/bash

# Script para testear el webhook de Contentful

echo "Testing webhook endpoint..."
echo ""

# Test GET (para verificar que está activo)
echo "1. Testing GET request..."
curl -X GET https://ursulabenavidez.com/api/revalidate
echo -e "\n"

# Test POST con autenticación (simula Contentful)
echo "2. Testing POST request with authentication..."
curl -X POST https://ursulabenavidez.com/api/revalidate \
  -H "Authorization: Bearer JteBdoSlgJlr8to/R7DS1GzqpEMD+DOXJmFm9yVgHiA=" \
  -H "Content-Type: application/json" \
  -d '{
    "sys": {
      "contentType": {
        "sys": {
          "id": "project"
        }
      }
    }
  }'
echo -e "\n"

echo "Done!"
