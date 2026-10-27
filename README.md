# Memory Sketch

**Thirty seconds. No peeking.**

Draw an everyday object from memory, reveal the reference, and save your wonderfully imperfect version.

![Memory Sketch: actual running application with English interface and light theme](assets/preview.jpg)

*Actual browser capture of the application, using local example data. Votes and completion counts shown are demonstration interactions, not audience statistics.*

### Try the flow

Choose a mug → start the 30-second round → sketch → reveal the reference → download a PNG.

English, Español, and Русский are selected from browser preferences, with a manual language selector. Light, dark, and system themes are available in every app. Native HTML, CSS, and JavaScript; no third-party browser libraries, external fonts, trackers, or CDN requests.

## Run

Serve `public/` with any static HTTP server at a domain root. For a local preview, for example:

```sh
python3 -m http.server 8080 --directory public
```

Open http://localhost:8080. Opening the HTML via `file://` is unsupported because native ES modules need HTTP. No Node.js server, database, API key, or build is needed in production.

## Checks

With Node.js 24+: `npm test` and `npm run check`.

## Deployment and data

Upload the contents of `public/` to your static host. Absolute asset paths assume a domain root; a GitHub Pages project subpath requires adapting paths or using a custom domain. Drawings, certificate names, and preferences stay on the device. Clearing site data removes drafts. Exported PNG files are created locally.

Four reference objects, a 30-second timer, pen colors, eraser, undo, PNG export, and shareable object challenges. Automatic recognition is not used. The canvas supports mouse and touch; drawing itself requires a pointing device.

## Develop with TypeScript

Generated JavaScript is committed, so production needs no TypeScript compiler. Development uses pinned tools:

```sh
npm ci
npm run typecheck
npm run build
npm run check:generated
npm test
npm run check
```

`src/preferences*.ts` is the source for language negotiation and the early theme bootstrap. Server projects also compile `src/validation.mts` into `server/validation.mjs`. `src/contracts.ts` describes shared data shapes. The compiler uses strict mode, checked indexed access, and exact optional properties; errors block emission. Edit these TypeScript sources, then rebuild. Other existing application modules are still JavaScript: this is an incremental migration, not a claim of complete TypeScript coverage.

The build emits ordinary ES2022 JavaScript, then compiles the three locale variants. No compiler or framework is shipped to visitors. CI checks types, generated output, behavior, and the asset budget.
