// netlify/functions/reveal.js
import { json, readState, writeState } from "./_store.js";

export default async (req) => {
if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
const { gameId, dare } = await req.json().catch(() => ({}));
if (!gameId) return json({ error: "Missing gameId" }, 400);

const state = await readState(gameId);
if (!state) return json({ error: "Not found" }, 404);
if (state.revealed) return json(state);

const loser = state.names.find(n => !state.tapped.includes(n));
if (!loser) return json({ error: "No loser yet" }, 400);

state.revealed = true;
state.loser = loser;
state.dare = String(dare || "").slice(0, 50);
state.version++;

await writeState(gameId, state);
return json(state);
};
