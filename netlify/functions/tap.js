// netlify/functions/tap.js
import { json, readState, writeState } from "./_store.js";

export default async (req) => {
if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
const { gameId, name } = await req.json().catch(() => ({}));
if (!gameId || !name) return json({ error: "Missing gameId or name" }, 400);

const state = await readState(gameId);
if (!state) return json({ error: "Not found" }, 404);
if (state.revealed) return json(state);

if (state.names.includes(name) && !state.tapped.includes(name)) {
state.tapped.push(name);
state.version++;
}
await writeState(gameId, state);
return json(state);
};
