# Coffee V1 compatibility fork — 2026-09-18

- Source: `raycast/extensions`, `extensions/coffee`, commit `2801380b5f250a8666c085b66ab890c620eb15ad`.
- Local target observed: `/Applications/Raycast.app`, version `1.104.29`. Installed Store Coffee depends on API `^2.1.2`.
- Separate extension identifier: `coffee-v1`; title: `Coffee V1`.
- API pinned to `1.104.25`, utils to `2.2.2`; macOS only. Removed Windows/Rust imports, implementation, and manifest platform.
- Preserved upstream macOS behavior and recent fixes. Retained MIT license and attribution.
- Repository: `https://github.com/cchen7/raycast-Coffee-v1`, branch `main`; initial commit imports the original extension for comparison. The user selected the `cchen7` account and supplied this repository as the publication destination.

## Verification

- `npm run build`: passed, including TypeScript checks; exports all 9 commands and 9 AI tools to `dist/`.
- `npm run lint`: passed, including manifest, icons, metadata, ESLint, and Prettier.
- `npm test`: 20 passed, 0 failed, including a new effect-replay regression test. See `TESTING.md` for actual host verification and limits.
- `git diff --check`: passed.
- Dependency installation/audit used the existing configured npm registry and a temporary cache, without global configuration changes. The lockfile omits registry-specific download URLs for portability.
- Audit still reports two low-severity entries for the API/esbuild dependency chain: Windows development-server arbitrary file read, GHSA-g7r4-m6w7-qqqr. This fork targets macOS and does not run that server. npm's suggested API 2.x upgrade conflicts with the compatibility target, so it was not applied.

## Remaining

- This standalone repository preserves source attribution and contains only Coffee; it does not have GitHub's formal fork relationship to the entire extensions monorepo.
- The installed checkout is now at `~/Local/raycast-Coffee-v1`. Keep that directory for future development and updates.
- Runtime tests verified start/stop, toggle, timed expiry, typed Until, and schedule state transitions. Until effect replay started two processes; the ref-guard fix passed both regression and runtime checks. Full menu-bar behavior, automatic background schedule timing, app selection, and auto-start remain unverified; see `TESTING.md`.
- Disable original Coffee background commands before runtime testing. The inherited implementation uses `killall caffeinate` and detects processes globally, so original Coffee, this fork, and other `caffeinate` users share process state. Existing preferences and schedules are not migrated automatically.

## Resolved verification issues

- The first build used upstream's `ray build -e dist`, which tried writing to Raycast's global extension directory and failed under the sandbox. The build script now explicitly uses `-o dist` and succeeds without installing.
- npm's default user cache was not writable under the sandbox. A temporary cache fixed the check; no ownership or global npm changes were made.

## Runtime test artifacts

Raw local evidence is under `/private/tmp/coffee-v1-runtime-20260918/`. It includes the command test log, process/power-assertion changes, the single-process Until retest, and in-host schedule results. The temporary runtime test command was removed after cleanup.
