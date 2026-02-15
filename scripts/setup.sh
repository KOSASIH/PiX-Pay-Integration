#!/bin/bash
echo "Setting up PiX-Pay-Integration..."

# Install dependencies
npm install

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Please fill in .env with your API keys."
fi

# Start MongoDB (assuming local)
mongod --dbpath ./data/db --fork --logpath ./logs/mongodb.log

# Run migrations (if any)
node scripts/migrate.js

# Seed data
node scripts/seed.js

echo "Setup complete. Run 'npm start' to launch."
