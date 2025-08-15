const { json, readBody, getState, saveState } = require('./_store');

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

const { gameId, dare } = await readBody(event);
if (!gameId) return json(400, { error: 'Missing gameId' });

const state = getState(gameId);
if (!state) return json(404, { error: 'Game not found' });

// Determine loser = only name not tapped
const loser = state.names.find(n => !state.tapped.includes(n)) || null;

state.revealed = true;
state.loser = loser;
state.dare = String(dare || '').slice(0, 200);

saveState(gameId, state);
return json(200, publicState(state));
};

function publicState(state) {
const { gameId, names, tapped, revealed, dare, loser } = state;
return { gameId, names, tapped, revealed, dare, loser };
}
