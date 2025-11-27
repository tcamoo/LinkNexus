# LinkNexus (原 VidGraph)

一个赛博朋克风格的 Telegram 文件上传工具。支持视频 (MP4/WebM) 和音频 (MP3/FLAC) 格式，并集成了 Cloudflare KV 历史记录功能。

## 功能特性
- **赛博朋克 UI**: 沉浸式深色科技风格体验。
- **多格式支持**: 自动识别并发送 Video 或 Audio 消息到 Telegram。
- **历史记录**: 使用 Cloudflare KV 保存并同步最近的上传记录。
- **大文件支持**: 配合本地 Bot Server 可支持高达 2GB 文件。

## Cloudflare 部署指南

### 1. 基础配置
1.  **Build Command**: `npm run build`
2.  **Output Directory**: `dist`
3.  **Path to Root**: 留空

### 2. 配置 KV (必须!)
为了使历史记录功能正常工作，你需要创建一个 KV Namespace。
1.  Cloudflare Dashboard -> **Workers & Pages** -> **KV**.
2.  创建名为 `VIDGRAPH_HISTORY` 的 Namespace。
3.  进入你的 Pages 项目设置 -> **Settings** -> **Functions**.
4.  **KV Namespace Bindings** -> Add Binding:
    - Variable name: `HISTORY_KV`
    - KV Namespace: 选择 `VIDGRAPH_HISTORY`
5.  **重新部署** (Retry Deployment)。

### 3. 本地 Bot Server (可选)
如果要上传 >50MB 文件：
1.  搭建 `aiogram/telegram-bot-api`。
2.  配置 Nginx 允许 CORS。
3.  在网页设置中填入 API 地址。
