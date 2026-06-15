#!/usr/bin/env bash
# Start MongoDB via Docker Compose (if needed), then run the API dev server.
set -euo pipefail

# Script lives at backend/src/scripts/dev.sh — repo root for compose + npm is backend/
BACKEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$BACKEND_ROOT"

echo ""
echo "🐳  Docker — checking daemon..."
if ! docker info >/dev/null 2>&1; then
  echo "❌  Docker is not running. Start Docker Desktop and try again." >&2
  exit 1
fi
echo "✅  Docker is up."

echo ""
echo "🍃  MongoDB — starting stack (docker compose)..."
docker compose -p chimu-mongo-dev up -d

CONTAINER_NAME="chimu-mongo"
echo "⏳  Waiting for MongoDB (${CONTAINER_NAME})..."
for i in $(seq 1 30); do
  if docker exec "$CONTAINER_NAME" mongosh --quiet --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1; then
    echo "✅  MongoDB is accepting connections."
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "❌  Timed out. Try: docker compose -p chimu-mongo-dev logs mongo" >&2
    exit 1
  fi
  sleep 1
done

# Replica set (--replSet in docker-compose) must be initiated once per fresh volume, or writes fail with "not primary".
echo ""
echo "🔄  Replica set — ensuring rs0 is initialized..."
if ! docker exec "$CONTAINER_NAME" mongosh --quiet --eval '
  try {
    rs.status();
  } catch (e) {
    rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });
  }
' >/dev/null 2>&1; then
  echo "⚠️  Could not run rs.initiate / rs.status. If you see \"not primary\" when seeding," >&2
  echo "   run: docker exec -it ${CONTAINER_NAME} mongosh --eval 'rs.status()'" >&2
fi

echo "⏳  Waiting for PRIMARY (writes need this)..."
for i in $(seq 1 45); do
  state="$(
    docker exec "$CONTAINER_NAME" mongosh --quiet --eval '
      try {
        rs.status().members[0].stateStr;
      } catch (e) {
        "";
      }
    ' 2>/dev/null | tr -d "\r" | head -1
  )"
  if [[ "$state" == "PRIMARY" ]]; then
    echo "✅  Replica set is PRIMARY — ready for writes."
    break
  fi
  if [[ "$i" -eq 45 ]]; then
    echo "❌  Timed out waiting for PRIMARY (last state: \"${state:-unknown}\")." >&2
    echo "   Debug: docker exec -it ${CONTAINER_NAME} mongosh --eval 'rs.status()'" >&2
    exit 1
  fi
  sleep 1
done

echo ""
echo "🚀  Starting API (pnpm run dev:server)..."
echo ""
exec pnpm run dev:server
