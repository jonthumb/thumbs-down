// netlify/functions/tap.js
import { json, readState, writeState } from "./_store.js";

export default async (req) => {
if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
const { gameId, name, clientId } = await req.json().catch(() => ({}));

if (!gameId || !name || !clientId) {
return json({ error: "Missing gameId, name or clientId" }, 400);
}

const state = await readState(gameId);
if (!state) return json({ error: "Not found" }, 404);
if (state.revealed) return json(state);

// Create claims bag if missing (for old games)
if (!state.claims) state.claims = {};

// If this client has already claimed a name, they cannot change it
const claimed = state.claims[clientId];
if (claimed && claimed !== name) {
// Return current state unchanged
return json(state);
}

// If not claimed yet, record their choice
if (!claimed) {
state.claims[clientId] = name;
}

// Apply the tap if that name wasn't already down
if (state.names.includes(name) && !state.tapped.includes(name)) {
state.tapped.push(name);
state.version++;
}

await writeState(gameId, state);
return json(state);
};
