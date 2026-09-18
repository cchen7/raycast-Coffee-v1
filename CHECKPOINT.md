# Coffee V1 compatibility fork — 2026-09-18

- Source: `raycast/extensions`, `extensions/coffee`, commit `2801380b5f250a8666c085b66ab890c620eb15ad`.
- Local target observed: `/Applications/Raycast.app`, version `1.104.29`. Installed Store Coffee depends on API `^2.1.2`.
- Separate extension identifier: `coffee-v1`; title: `Coffee V1`.
- API pinned to `1.104.25`, utils to `2.2.2`; macOS only. Removed Windows/Rust imports, implementation, and manifest platform.
- Preserved upstream macOS behavior and recent fixes. Retained MIT license and attribution.
- Local Git branch: `raycast-v1`; initial commit imports the original extension for comparison. No GitHub remote created yet; destination account has not been selected.

## Verification

- `npm run build`: passed, including TypeScript checks; exports all 9 commands and 9 AI tools to `dist/`.
- `npm run lint`: passed, including manifest, icons, metadata, ESLint, and Prettier.
- `npm test`: 19 passed, 0 failed. These are upstream unit tests with mocked Raycast APIs/processes.
- `git diff --check`: passed.
- Dependency installation/audit used the existing configured npm registry and a temporary cache, without global configuration changes. The lockfile omits registry-specific download URLs for portability.
- Audit still reports two low-severity entries for the API/esbuild dependency chain: Windows development-server arbitrary file read, GHSA-g7r4-m6w7-qqqr. This fork targets macOS and does not run that server. npm's suggested API 2.x upgrade conflicts with the compatibility target, so it was not applied.

## Remaining

- Choose the GitHub destination account and repository before publishing. A standalone `raycast-coffee-v1` repository avoids maintaining the entire extensions monorepo; it will preserve source attribution but will not have GitHub's formal fork relationship.
- Move the checkout to a stable user-selected location before registering it in Raycast; the current checkout is under temporary storage.
- Run `npm run dev` to register Coffee V1 and verify actual behavior in Raycast 1.104.29: timed start/expiry, manual stop, menu bar, app selection, and a short schedule. It has not been installed or tested inside Raycast yet.
- Disable original Coffee background commands before runtime testing. The inherited implementation uses `killall caffeinate` and detects processes globally, so original Coffee, this fork, and other `caffeinate` users share process state. Existing preferences and schedules are not migrated automatically.

## Resolved verification issues

- The first build used upstream's `ray build -e dist`, which tried writing to Raycast's global extension directory and failed under the sandbox. The build script now explicitly uses `-o dist` and succeeds without installing.
- npm's default user cache was not writable under the sandbox. A temporary cache fixed the check; no ownership or global npm changes were made.
