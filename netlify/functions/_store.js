// netlify/functions/_store.js
import { getStore } from "@netlify/blobs";

const NAMESPACE = "games"; // logical bucket

export async function readState(gameId) {
const store = getStore(NAMESPACE);
const raw = await store.get(`games/${gameId}.json`);
return raw ? JSON.parse(raw) : null;
}

export async function writeState(gameId, state) {
const store = getStore(NAMESPACE);
await store.set(`games/${gameId}.json`, JSON.stringify(state), {
contentType: "application/json"
});
return state;
}

export function json(data, status = 200) {
return new Response(JSON.stringify(data), {
status,
headers: { "Content-Type": "application/json" }
});
}
