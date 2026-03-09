$ErrorActionPreference = "Stop"

if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

Write-Host "[1/5] Starting local infra"
docker compose -f infra/docker/docker-compose.yml up -d

Write-Host "[2/5] Installing dependencies"
pnpm install

Write-Host "[3/5] Running migrations"
pnpm db:migrate

Write-Host "[4/5] Seeding corpus"
pnpm db:seed

Write-Host "[5/5] Starting apps and services"
pnpm dev
