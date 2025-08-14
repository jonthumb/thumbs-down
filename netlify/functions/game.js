// netlify/functions/game.js
import { json, writeState } from "./_store.js";

export default async (req) => {
if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

const body = await req.json().catch(() => ({}));
const names = Array.isArray(body.names) ? body.names.filter(Boolean).slice(0, 10) : [];
if (names.length < 3) return json({ error: "Need at least 3 names" }, 400);

const gameId = crypto.randomUUID();
const state = {
version: 1,
names,
tapped: [], // names who are down
claims: {}, // clientId -> name (one name per device)
revealed: false,
loser: null,
dare: null
};

await writeState(gameId, state);
return json({ gameId, state });
};
