export async function onRequestGet(context) {
  try {
    const { env } = context;
    if (!env.HISTORY_KV) {
      return new Response(JSON.stringify({ error: "KV not bound" }), { status: 500 });
    }

    // Get list of keys (limit 20 for example)
    const list = await env.HISTORY_KV.list({ limit: 20, prefix: "hist:" });
    const keys = list.keys;

    // Fetch values
    const items = [];
    for (const key of keys) {
      const value = await env.HISTORY_KV.get(key.name);
      if (value) items.push(JSON.parse(value));
    }

    // Sort by timestamp desc
    items.sort((a, b) => b.timestamp - a.timestamp);

    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.HISTORY_KV) {
      // If no KV bound, just return success (fallback for no-history mode)
      return new Response(JSON.stringify({ success: false, reason: "KV not bound" }), { status: 200 });
    }

    const item = await request.json();
    
    // Key format: hist:TIMESTAMP_UUID
    const key = `hist:${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Expire after 30 days (optional)
    await env.HISTORY_KV.put(key, JSON.stringify(item), { expirationTtl: 2592000 });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
