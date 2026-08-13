#!/bin/bash

echo "Starting backend..."
cd server
npm run dev &
SERVER_PID=$!

echo "Starting frontend..."
cd ../client
npm start &
CLIENT_PID=$!

echo ""
echo "Backend PID: $SERVER_PID"
echo "Frontend PID: $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop both"

wait
