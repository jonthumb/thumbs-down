const { json, getState } = require('./_store');

exports.handler = async (event) => {
const gameId = (event.queryStringParameters || {}).gameId;
if (!gameId) return json(400, { error: 'Missing gameId' });

const state = getState(gameId);
if (!state) return json(404, { error: 'Game not found' });

return json(200, publicState(state));
};

function publicState(state) {
const { gameId, names, tapped, revealed, dare, loser } = state;
return { gameId, names, tapped, revealed, dare, loser };
}
