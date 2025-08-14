// netlify/functions/state.js
import { json, readState } from "./_store.js";

export default async (req) => {
const url = new URL(req.url);
const gameId = url.searchParams.get("gameId");
if (!gameId) return json({ error: "Missing gameId" }, 400);

const state = await readState(gameId);
if (!state) return json({ error: "Not found" }, 404);

return json(state);
};
