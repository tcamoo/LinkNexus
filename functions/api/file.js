export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const fileId = url.searchParams.get("id");
  const configApiRoot = env.TG_API_ROOT; // Optional custom API root

  // Validate Configuration (Bot Token is needed unless using a public custom API that doesn't need it, but generally we assume we need it)
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
    // If TG_API_ROOT is set, use it. Otherwise use official API.
    const apiBase = configApiRoot ? configApiRoot.replace(/\/$/, '') : "https://api.telegram.org";
    const getFileUrl = `${apiBase}/bot${env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`;
    
    const fileRes = await fetch(getFileUrl);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
        // Handle "file is too big" specifically
        if (fileData.error_code === 400 && fileData.description?.includes("file is too big")) {
            return new Response(JSON.stringify({ 
                error: "File is too big for the official Telegram API (Limit 20MB for download).",
                solution: "Please configure TG_API_ROOT environment variable to point to a local Telegram Bot API server."
            }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
      return new Response("Telegram Error: " + (fileData.description || "Unknown error"), { status: 502 });
    }

    const filePath = fileData.result.file_path;
    
    // Construct download URL
    // Official API: https://api.telegram.org/file/bot<token>/<file_path>
    // Local API: http://root/file/bot<token>/<file_path>
    const downloadUrl = `${apiBase}/file/bot${env.TG_BOT_TOKEN}/${filePath}`;

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
    if (filePath.endsWith(".webm")) responseHeaders.set("Content-Type", "video/webm");
    if (filePath.endsWith(".mp3")) responseHeaders.set("Content-Type", "audio/mpeg");
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) responseHeaders.set("Content-Type", "image/jpeg");
    if (filePath.endsWith(".png")) responseHeaders.set("Content-Type", "image/png");
    if (filePath.endsWith(".webp")) responseHeaders.set("Content-Type", "image/webp");

    return new Response(contentRes.body, {
        status: contentRes.status,
        headers: responseHeaders
    });

  } catch (e) {
    return new Response("Proxy Error: " + e.message, { status: 500 });
  }
}
