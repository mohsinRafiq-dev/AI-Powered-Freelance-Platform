# Loom-like In-App Recorder — Integration Guide

This document describes the in-app Loom-like video recorder implemented in this repository. It explains architecture, file locations, environment setup, run steps, API usage, testing, and troubleshooting.

---

## SECTION 1 — Architecture Explanation

- User clicks the record button in the existing chat composer (`MessageComposer.jsx`).
- A slide-in `RecorderPanel` opens inside the app UI (right side). It uses the browser Media APIs (`getUserMedia`, `getDisplayMedia`, `MediaRecorder`) to capture camera/microphone or screen.
- The recorded video is captured to Blobs by `MediaRecorder`. The panel allows preview and sends the recorded file to the backend via `POST /api/videos` using `multipart/form-data`. The client shows upload progress.
- The backend saves the received file to S3 (if configured) or to a local `/uploads/videos` fallback. After upload and DB persistence, the server broadcasts the chat message via Socket.IO (`new_message`).
- Frontend receives `new_message` events and renders video messages inline using HTML5 `<video>` (lazy-loaded, responsive).

Security & constraints:
- The server stores only the file URL in MongoDB (no raw video in DB).
- Backend does not proxy video content; public URLs are used for playback.
- Authentication is expected to be handled by your existing middleware; the upload route uses `req.user` if present.

Files added/modified (key):
- `client/src/components/RecorderPanel.jsx` — in-page recorder UI and uploader.
- `client/src/features/messages/components/MessageComposer.jsx` — composer button wired to open the recorder.
- `client/src/lib/loom.js` — optional Loom SDK adapter (kept but not required for in-app recorder).
- `client/src/socket.js` — Socket.IO helper to initialize connection.
- `server/src/routes/videos.js` — video upload route (S3 or local fallback).
- `server/src/loomServer.js` — server entrypoint updated to serve uploads and mount route.
- `server/src/models/Message.js` — updated message schema to include `video` type.
- `server/src/socketHandlers/loomSocket.js` — socket handlers (broadcasting new_message).

---

## SECTION 2 — Frontend: Installation & Files

Dependencies (client):

```
cd client
npm install socket.io-client
```

Files of interest and where to place them (already added by the integration):
- `client/src/components/RecorderPanel.jsx` — slide-in recorder. Uses MediaRecorder and uploads to `/api/videos`.
- `client/src/features/messages/components/MessageComposer.jsx` — composer with 🎥 button that opens the panel.
- `client/src/lib/loom.js` — optional adapter (not required for the in-app recorder).
- `client/src/socket.js` — socket helper to initialize connection.

Notes about integrating `RecorderPanel` into your chat app:
- Ensure `MessageComposer` receives the proper `chatId` (and `currentUserId`) and passes it to `RecorderPanel`. The existing composer code uses `replyTo?.conversation` heuristically — for production set it explicitly.

Example: if your chat view has `chatId` and `user` available, render composer as:

```jsx
// <ChatView />
<MessageComposer
  onSend={handleSend}
  isConnected={socketConnected}
  replyTo={reply}
  // ...other props
/>

// Open RecorderPanel with explicit props
<RecorderPanel chatId={chatId} currentUserId={user._id} onClose={() => setShowRecorder(false)} />
```

---

## SECTION 3 — Backend: Installation & Files

Server dependencies required (additional):

```
cd server
npm install @aws-sdk/client-s3 multer
```

Files of interest:
- `server/src/routes/videos.js` — POST `/api/videos` receives multipart upload (field name `video`) and `chatId` in body. It stores to S3 when AWS env vars exist, otherwise saves to local `uploads/videos` and returns a public path.
- `server/src/loomServer.js` — updated server entrypoint that mounts `/api/videos` and serves `/uploads` statically.
- `server/src/models/Message.js` — Mongoose schema for messages (includes `type: 'video'`) and indexing for chat reads.
- `server/src/socketHandlers/loomSocket.js` — broadcasts `new_message` and handles chat room join.

Server environment variables (create `.env` in `server/`):

```
MONGODB_URI=mongodb://<user>:<pass>@host:port/dbname
PORT=4000

# Optional S3 settings for production
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

If you don't set S3 variables, uploads are saved locally to `uploads/videos` and served at `http://<server>/uploads/videos/<filename>`.

---

## SECTION 4 — Media Recorder Logic (how it works)

Recorder behavior (see `client/src/components/RecorderPanel.jsx`):

- Device enumeration: the panel uses `navigator.mediaDevices.enumerateDevices()` to list camera/mic inputs.
- Camera capture: `navigator.mediaDevices.getUserMedia({ video, audio })`.
- Screen capture: `navigator.mediaDevices.getDisplayMedia({ video, audio })`.
- Recording: `MediaRecorder` instances are created from the active stream (screen preferred when active). Data is collected via `ondataavailable` into an array of Blobs.
- Stop: `mediaRecorder.stop()` finalizes the recording. A preview `Blob` is created and object-URL displayed in a `<video>` element.
- Upload: when user clicks Send, a `FormData` is created with `video` file (WebM), `chatId`, and `duration`. The frontend sends this to `/api/videos` using `XMLHttpRequest` to enable progress monitoring.

Notes on format and compatibility:
- Default recording uses `video/webm;codecs=vp9` when available, with fallback to the browser's default. WebM has broad modern browser support. If you need MP4, transcode on server or request different encoders (more complex).

---

## SECTION 5 — Upload & Storage (server side)

Upload route: `POST /api/videos`
- Request: `multipart/form-data` with field `video` and form fields `chatId` and `duration` (seconds). Optionally `senderId` when `req.user` unavailable.
- Behavior:
  - If AWS S3 environment is configured, uploads to S3 using `@aws-sdk/client-s3` and returns the S3 public URL.
  - Otherwise saves to `server/uploads/videos/` and returns `/uploads/videos/<file>` URL (served statically).
  - Creates a `Message` record in MongoDB with `type: 'video'` and `url` pointing to the public URL.
  - Broadcasts a `new_message` Socket.IO event to the chat room `chatId` with the persisted message object.

Security considerations:
- Ensure `req.user` (your auth middleware) populates `req.user._id`. The route prefers `req.user` for `senderId`. If your app uses session or JWT, make sure the upload route is protected and sets `req.user`.
- For S3, never hard-code credentials. Use environment variables or IAM roles in production.

---

## SECTION 6 — Chat Integration (events & rendering)

Socket events used:
- `join_conversation` (client -> server) — call `socket.emit('join_conversation', conversationId)` when user opens a chat.
- `new_message` (server -> clients) — server emits broadcast messages to the chat room.

Message structure (video message):

```json
{
  "id": "<mongo-id>",
  "type": "video",
  "url": "https://.../videos/xxxx.webm",
  "senderId": "...",
  "chatId": "...",
  "createdAt": "2025-12-21T...",
  "duration": 42
}
```

Frontend rendering:
- When receiving `new_message`, append to message list. If `message.type === 'video'`, render an inline `<video controls preload="none" playsInline>` element with `src={message.url}`. Lazy-load by using `loading="lazy"` on parent if possible or by rendering `<video>` only when message enters viewport (IntersectionObserver optional).

Example render component snippet:

```jsx
function VideoMessage({ url }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <video src={url} controls style={{ width: '100%', height: 'auto' }} preload="none" />
    </div>
  );
}
```

---

## SECTION 7 — Edge Cases & Troubleshooting

- Browser permission denied: show a user-friendly modal instructing users to allow camera/mic; provide a fallback to screen recording only.
- Large files / slow networks: client shows upload progress and server limits uploads via `multer` configuration (`limits.fileSize`). Adjust limit if necessary.
- Mobile behavior: `getDisplayMedia` support varies; screen capture may not be available on mobile — allow camera-only recording on mobile.
- Transcoding/compatibility: WebM playback support is broad on modern browsers; for older Safari you may need a server-side transcode to MP4 (e.g., ffmpeg).
- Authentication: if uploads are unauthenticated, `senderId` can be spoofed. Protect upload route with your auth middleware.
- Storage costs: S3 is recommended for production. Use lifecycle rules to manage retention if needed.

Troubleshooting tips:
- If upload fails with 403 from S3, verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` and that the IAM user has PutObject permission for the configured bucket.
- If the video doesn't appear in chat: check server logs to ensure message persisted and `io.to(chatId).emit('new_message', ...)` executed.
- If local fallback video won't play: ensure `server/loomServer.js` serves `/uploads` statically and public URL mapping is correct.

---

## SECTION 8 — Final Verification Checklist

- [ ] Clicking the 🎥 button opens the slide-in `RecorderPanel` without leaving the page.
- [ ] The panel lists available camera/microphone devices (or gracefully handles their absence).
- [ ] User can choose camera or screen capture, record, pause/resume, stop, preview.
- [ ] Preview plays back correctly in the panel.
- [ ] Clicking Send uploads the file and shows upload progress.
- [ ] Server stores the file (S3 or local fallback) and returns a public URL.
- [ ] Server persists a `video` message in MongoDB and broadcasts `new_message`.
- [ ] All connected clients in the chat show the new video message and can play it inline.

---

## Quick Start — Commands

Server

```bash
cd server
npm install
# optional for S3
npm install @aws-sdk/client-s3 multer

# create .env with MONGODB_URI and optional AWS_* vars
npm run dev
```

Client

```bash
cd client
npm install
npm run dev
```

Open the client app in a browser, open devtools console for errors, open a chat, click the 🎥 button, allow camera, record, preview, and send.

---

If you want, I can now:
- Patch your chat container to pass `chatId` and `currentUserId` into `RecorderPanel` (so it uses real values instead of the `replyTo` fallback).
- Add an automated test or a demo script.
- Add server-side optional ffmpeg transcode worker to produce MP4 for broader compatibility.

Which follow-up would you like next?
