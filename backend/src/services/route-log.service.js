import pg from "pg";

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;

let pool;
let initialized = false;

function getPool() {
  if (!DATABASE_URL) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL
    });
  }

  return pool;
}

async function ensureTable(client) {
  if (initialized) return;

  await client.query(`
    CREATE TABLE IF NOT EXISTS route_logs (
      id BIGSERIAL PRIMARY KEY,
      origin_lat DOUBLE PRECISION NOT NULL,
      origin_lng DOUBLE PRECISION NOT NULL,
      destination_lat DOUBLE PRECISION NOT NULL,
      destination_lng DOUBLE PRECISION NOT NULL,
      mode TEXT NOT NULL,
      distance_meters INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  initialized = true;
}

export async function logRoute({ origin, destination, mode, distanceMeters, durationSeconds }) {
  const db = getPool();
  if (!db) return;

  const client = await db.connect();

  try {
    await ensureTable(client);
    await client.query(
      `
        INSERT INTO route_logs (
          origin_lat,
          origin_lng,
          destination_lat,
          destination_lng,
          mode,
          distance_meters,
          duration_seconds
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng,
        mode,
        Math.round(distanceMeters),
        Math.round(durationSeconds)
      ]
    );
  } finally {
    client.release();
  }
}
