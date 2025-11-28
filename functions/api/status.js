export async function onRequest(context) {
  const { env } = context;
  
  // Check if critical variables are present
  const hasToken = !!env.TG_BOT_TOKEN;
  const hasChatId = !!env.TG_CHAT_ID;

  if (hasToken && hasChatId) {
    return new Response(JSON.stringify({ 
        status: 'connected',
        mode: env.TG_API_ROOT ? 'custom_root' : 'official'
    }), { 
        headers: { "Content-Type": "application/json" } 
    });
  } else {
    return new Response(JSON.stringify({ 
        status: 'disconnected',
        missing: [
            !hasToken ? 'TG_BOT_TOKEN' : null,
            !hasChatId ? 'TG_CHAT_ID' : null
        ].filter(Boolean)
    }), { 
        headers: { "Content-Type": "application/json" } 
    });
  }
}
