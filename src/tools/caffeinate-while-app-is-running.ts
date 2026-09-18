import { runAppleScript } from "@raycast/utils";
import { startCaffeinate, deviceName } from "../utils";

type Input = {
  /**
   * Name of the application to watch (e.g., "Zoom", "Chrome", "Photoshop")
   */
  application: string;
};

type ProcessEntry = {
  id: string;
  name: string;
};

/**
 * Prevents your computer from sleeping while a specific application is running
 */
export default async function (input: Input) {
  const { application } = input;

  // Get all running processes
  const processes = await getRunningProcesses();

  // Find the process for the requested application
  const target = findProcess(processes, application);
  if (!target) {
    throw new Error(`Application "${application}" is not currently running`);
  }

  await startCaffeinate({ menubar: true, status: true }, undefined, `-w ${target.id}`, {
    kind: "while",
    appName: application,
  });

  return `${deviceName()} will stay awake while ${application} is running`;
}

async function getRunningProcesses(): Promise<ProcessEntry[]> {
  const ids = (
    await runAppleScript(
      `tell application "System Events" to get the unix id of every process whose background only is false`,
    )
  ).split(", ");
  const names = (
    await runAppleScript(
      `tell application "System Events" to get the name of every process whose background only is false`,
    )
  ).split(", ");

  return names.map((name, index) => ({ id: ids[index], name: name.toLowerCase() }));
}

function findProcess(processes: ProcessEntry[], appName: string): ProcessEntry | undefined {
  const query = appName.toLowerCase();

  // Try exact match first
  const exactMatch = processes.find((process) => process.name === query);
  if (exactMatch) return exactMatch;

  // Try partial match
  return processes.find((process) => process.name.includes(query) || query.includes(process.name));
}
