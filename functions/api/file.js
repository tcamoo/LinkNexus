export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const fileId = url.searchParams.get("id");

  // Validate Configuration
  if (!env.TG_BOT_TOKEN) {
    return new Response(JSON.stringify({ error: "Server Config Error: TG_BOT_TOKEN missing in Cloudflare Environment Variables" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!fileId) {
    return new Response("Missing file ID", { status: 400 });
  }

  try {
    // 1. Get File Path from Telegram API
    const getFileUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`;
    const fileRes = await fetch(getFileUrl);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return new Response("Telegram Error: " + (fileData.description || "Unknown error"), { status: 502 });
    }

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${env.TG_BOT_TOKEN}/${filePath}`;

    // 2. Proxy File Stream
    // We forward the Range header to support video seeking (scurbbing)
    const range = request.headers.get("Range");
    const headers = new Headers({
        "User-Agent": "VidGraph-Proxy"
    });
    if (range) headers.set("Range", range);

    const contentRes = await fetch(downloadUrl, { headers });
    
    // Copy headers from Telegram response (Content-Type, Content-Length, Content-Range, etc.)
    const responseHeaders = new Headers(contentRes.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    
    // Force specific content types if Telegram sends generic stream
    if (filePath.endsWith(".mp4")) responseHeaders.set("Content-Type", "video/mp4");
    if (filePath.endsWith(".mp3")) responseHeaders.set("Content-Type", "audio/mpeg");

    return new Response(contentRes.body, {
        status: contentRes.status,
        headers: responseHeaders
    });

  } catch (e) {
    return new Response("Proxy Error: " + e.message, { status: 500 });
  }
}
