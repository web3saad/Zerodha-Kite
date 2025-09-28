#!/usr/bin/env python3
import requests
import json

try:
    # Test the orders API endpoint
    response = requests.get('http://localhost:3000/api/admin/orders-page', timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")