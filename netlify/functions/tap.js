const { json, readBody, getState, saveState } = require('./_store');

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

const { gameId, name, clientId } = await readBody(event);
if (!gameId || !name || !clientId) return json(400, { error: 'Missing fields' });

const state = getState(gameId);
if (!state) return json(404, { error: 'Game not found' });
if (state.revealed) return json(400, { error: 'Game already revealed' });

const n = String(name).trim();
if (!state.names.includes(n)) return json(400, { error: 'Unknown name' });

// Enforce one device → one name per game
const locked = state.deviceLocks[clientId];
if (locked && locked !== n) {
return json(400, { error: 'This device already tapped a different name in this game' });
}

if (!state.tapped.includes(n)) {
state.tapped.push(n);
state.deviceLocks[clientId] = n;
}

saveState(gameId, state);
return json(200, publicState(state));
};

function publicState(state) {
const { gameId, names, tapped, revealed, dare, loser } = state;
return { gameId, names, tapped, revealed, dare, loser };
}
