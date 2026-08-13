#!/bin/bash

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy server/.env.example → server/.env and fill in values"
echo "2. Copy client/.env.example → client/.env"
echo "3. Make sure MongoDB is running"
echo "4. Run: cd server && npm run dev"
echo "5. In another terminal: cd client && npm start"
