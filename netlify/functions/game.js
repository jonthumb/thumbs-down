const { json, readBody, saveState } = require('./_store');
const { randomUUID } = require('crypto');

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') {
return json(405, { error: 'Method not allowed' });
}

const { names } = await readBody(event);
const clean = (Array.isArray(names) ? names : [])
.map(n => String(n || '').trim())
.filter(Boolean)
.slice(0, 10);

if (clean.length < 3) return json(400, { error: 'Add at least 3 names' });

const gameId = randomUUID();
const state = {
gameId,
names: clean,
tapped: [],
revealed: false,
dare: null,
loser: null,
// deviceId -> name (enforces one device, one name per game)
deviceLocks: {}
};

saveState(gameId, state);
return json(200, { gameId, state: publicState(state) });
};

function publicState(state) {
const { gameId, names, tapped, revealed, dare, loser } = state;
return { gameId, names, tapped, revealed, dare, loser };
}
