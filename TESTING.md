# Raycast 1.x verification — 2026-09-18

Tested on macOS with the installed Raycast **1.104.29** application. The extension helper reported `RAYCAST_VERSION=1.104.29`; an in-host validation command independently reported the same version. API and utils remain pinned to `1.104.25` and `2.2.2`.

## Passed

| Check                      | Evidence                                                                                                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local installation         | Coffee V1 commands appeared in Raycast without requiring a v2 upgrade.                                                                                                                                                                                                                  |
| Start and manual stop      | The real `/usr/bin/caffeinate -u -dmi` process appeared and exited in response to commands. macOS power assertions confirmed sleep prevention.                                                                                                                                          |
| Toggle on and off          | Both transitions were observed using actual process state.                                                                                                                                                                                                                              |
| Timed caffeination         | A 30-second UI invocation started and expired; a separate 10-second invocation exited after approximately 10.5 seconds.                                                                                                                                                                 |
| Negative duration          | No process was created for `-1` seconds.                                                                                                                                                                                                                                                |
| Until                      | The typed-time command started and expired. After the fix below, only one process existed throughout the run; polling observed its exit 6.6 seconds after the selected minute. This is an observation including process reaping/polling, not an exact power-assertion timing guarantee. |
| Schedule state transitions | A temporary command inside Raycast used real LocalStorage and the same `checkSchedule`, `changeScheduleState`, and stop functions as the extension to verify start, pause, resume, and end. The end branch was exercised by changing the test schedule to an elapsed time range.        |
| Schedule cleanup           | The temporary schedule was removed and no test caffeinate process remained.                                                                                                                                                                                                             |
| Automated checks           | 20 tests passed; production build with TypeScript checks, Raycast lint, and whitespace checks passed.                                                                                                                                                                                   |

## Issue found and fixed

Typed `Caffeinate Until` launched two independent caffeinate processes in development. Its effect used a state value as a guard, so replaying the effect before a rerender could start the command twice. The fix uses a synchronous ref guard, matching `Caffeinate for ...`.

A regression test failed against the previous source (`2 !== 1`), passed after the change, and the actual Raycast run subsequently maintained a single process through expiry.

## Limits and unresolved observations

- Menu-bar registration/enabling was observed, but actual menu clicks and live countdown rendering were not fully validated. The development log contained one `index` execution timeout (`54s max`); its cause has not been isolated, so the menu bar is not considered fully verified.
- Automatic schedule activation at a future wall-clock time through Raycast's recurring background refresh was not tested. The successful schedule checks above exercised real runtime state transitions directly.
- Application selection and automatic stop when a selected app exits, launch auto-caffeination, date-picker submission, and AI chat/tool invocation remain untested in the application. The picker has unit-test coverage only.
- Native UI automation repeatedly stalled and ultimately reported an inactive control session. Those interactions are not counted as successful tests.
- Initial deeplink automation attempts timed out or used form-style `+` encoding for JSON spaces. Later tests explicitly targeted `/Applications/Raycast.app`, used percent-encoded arguments, and gave invocations distinct context values. Harness failures were retained locally and did not require extension changes.

The temporary validation command and its manifest entry were removed after testing. Normal commands remain installed from a stable local checkout; no test schedule is intentionally left behind.
