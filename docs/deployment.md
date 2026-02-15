# Deployment Guide

## Local Development
1. Clone repo.
2. `npm install`.
3. Set .env vars.
4. `npm start` (port 3000).

## Docker
- `docker build -t pix-pay .`
- `docker run -p 3000:3000 pix-pay`

## Docker Compose
- `docker-compose up` (includes MongoDB).

## Kubernetes
- Apply k8s/ files: `kubectl apply -f k8s/`
- Expose service: `kubectl expose deployment pix-pay --type=LoadBalancer --port=3000`

## Heroku
- `npm run deploy:heroku` (requires Heroku CLI).

## Production Notes
- Use HTTPS.
- Monitor logs with Winston.
- Backup MongoDB.
- Scale pods based on CPU.
