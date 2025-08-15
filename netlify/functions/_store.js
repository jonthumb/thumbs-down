// Simple in-memory store for game state (resets when the function cold-starts)
let DB = {};

function json(status, data) {
return {
statusCode: status,
headers: { 'content-type': 'application/json' },
body: JSON.stringify(data)
};
}

async function readBody(event) {
try { return JSON.parse(event.body || '{}'); }
catch { return {}; }
}

function getState(gameId) {
return DB[gameId];
}
function saveState(gameId, state) {
DB[gameId] = state;
return state;
}

module.exports = { json, readBody, getState, saveState };
