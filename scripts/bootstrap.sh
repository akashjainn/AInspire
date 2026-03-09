#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "[1/5] Starting local infra"
docker compose -f infra/docker/docker-compose.yml up -d

echo "[2/5] Installing dependencies"
pnpm install

echo "[3/5] Running migrations"
pnpm db:migrate

echo "[4/5] Seeding corpus"
pnpm db:seed

echo "[5/5] Starting apps and services"
pnpm dev
