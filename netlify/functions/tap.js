// netlify/functions/tap.js
// Enforce: one device (clientId) can only lock one name per game.

const { loadGame, saveGame } = require('./lib/state'); 
// ^^^ Adjust this path to your real helpers (same ones used by /api/state and /api/reveal)

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') {
return { statusCode: 405, body: 'Method Not Allowed' };
}

try {
const body = JSON.parse(event.body || '{}');
const { gameId, name, clientId } = body;

if (!gameId || !name || !clientId) {
return { statusCode: 400, body: JSON.stringify({ error: 'Missing gameId, name or clientId' }) };
}

const state = await loadGame(gameId);
if (!state) {
return { statusCode: 404, body: JSON.stringify({ error: 'Game not found' }) };
}

// Ensure structures exist
state.tapped = Array.isArray(state.tapped) ? state.tapped : [];
state.claims = state.claims || {}; // { [clientId]: "Alice" }

const alreadyClaimed = state.claims[clientId];

// If this device already claimed a different name, block
if (alreadyClaimed && alreadyClaimed !== name) {
return {
statusCode: 409,
body: JSON.stringify({ error: "You've already tapped a different name on this device for this game." })
};
}

// If this name is already locked by anyone, block
if (state.tapped.includes(name)) {
return {
statusCode: 409,
body: JSON.stringify({ error: "That name is already locked." })
};
}

// Record claim and tap (idempotent for same device+same name)
state.claims[clientId] = name;
if (!state.tapped.includes(name)) state.tapped.push(name);

await saveGame(gameId, state);
return { statusCode: 200, body: JSON.stringify(state) };
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: 'Server error', detail: e.message }) };
}
};
