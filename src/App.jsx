16:23:11.441 Running build in Washington, D.C., USA (East) – iad1
16:23:11.442 Build machine configuration: 2 cores, 8 GB
16:23:11.552 Cloning github.com/chilebowl/Athena-Dashboard (Branch: main, Commit: c4a9242)
16:23:11.553 Previous build caches not available.
16:23:11.737 Cloning completed: 185.000ms
16:23:12.057 Running "vercel build"
16:23:12.783 Vercel CLI 51.6.1
16:23:13.356 Installing dependencies...
16:23:23.371 
16:23:23.372 added 62 packages in 10s
16:23:23.373 
16:23:23.373 7 packages are looking for funding
16:23:23.373   run `npm fund` for details
16:23:23.413 Running "npm run build"
16:23:23.757 
16:23:23.758 > athena-dashboard@1.0.0 build
16:23:23.758 > vite build
16:23:23.758 
16:23:25.106 [36mvite v5.4.21 [32mbuilding for production...[36m[39m
16:23:25.155 transforming...
16:23:25.192 [32m✓[39m 3 modules transformed.
16:23:25.193 [31mx[39m Build failed in 63ms
16:23:25.194 [31merror during build:
16:23:25.194 [31m[vite:esbuild] Transform failed with 1 error:
16:23:25.195 /vercel/path0/src/App.jsx:1:36: ERROR: Expected string but found "“"[31m
16:23:25.195 file: [36m/vercel/path0/src/App.jsx:1:36[31m
16:23:25.195 [33m
16:23:25.195 [33mExpected string but found "“"[33m
16:23:25.195 1  |  import { useState, useEffect } from “react”;
16:23:25.195    |                                      ^
16:23:25.195 2  |  
16:23:25.196 3  |  // ── FONT INJECTION ────────────────────────────────────────────────────────────
16:23:25.196 [31m
16:23:25.196     at failureErrorWithLog (/vercel/path0/node_modules/esbuild/lib/main.js:1472:15)
16:23:25.196     at /vercel/path0/node_modules/esbuild/lib/main.js:755:50
16:23:25.196     at responseCallbacks.<computed> (/vercel/path0/node_modules/esbuild/lib/main.js:622:9)
16:23:25.196     at handleIncomingPacket (/vercel/path0/node_modules/esbuild/lib/main.js:677:12)
16:23:25.196     at Socket.readFromStdout (/vercel/path0/node_modules/esbuild/lib/main.js:600:7)
16:23:25.196     at Socket.emit (node:events:508:28)
16:23:25.196     at addChunk (node:internal/streams/readable:563:12)
16:23:25.197     at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
16:23:25.197     at Readable.push (node:internal/streams/readable:394:5)
16:23:25.197     at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)[39m
16:23:25.213 Error: Command "npm run build" exited with 1
