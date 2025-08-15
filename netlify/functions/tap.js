// netlify/functions/tap.js
const { json, readBody, getState, saveState } = require('./_store');

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
const { gameId, name, clientId } = await readBody(event);
if (!gameId || !name || !clientId) return json(400, { error: 'Missing fields' });

const state = getState(gameId);
if (!state) return json(404, { error: 'Game not found' });
if (state.revealed) return json(400, { error: 'Game already revealed' });

const nInput = String(name).trim().toLowerCase();
const idx = state.names.findIndex(n => String(n).trim().toLowerCase() === nInput);
if (idx === -1) return json(400, { error: 'Name not in this game' });

const canonical = state.names[idx];
const locked = state.deviceLocks[clientId];
if (locked && locked !== canonical) return json(400, { error: 'This device already tapped a different name in this game' });

if (!state.tapped.includes(canonical)) {
state.tapped.push(canonical);
state.deviceLocks[clientId] = canonical;
}

saveState(gameId, state);
return json(200, publicState(state));
};

function publicState(s){ const { gameId, names, tapped, revealed, dare, loser } = s; return { gameId, names, tapped, revealed, dare, loser }; }
