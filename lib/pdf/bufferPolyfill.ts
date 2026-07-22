import { Buffer } from "buffer";

// @signpdf/* and node-forge assume the Node.js `Buffer` global exists.
// Next.js/Turbopack don't polyfill Node builtins for the browser bundle,
// so we install one before any of those libraries run.
if (typeof globalThis.Buffer === "undefined") {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}
