import { zipSync } from "fflate";

export function zipFiles(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const input: Record<string, Uint8Array> = {};
  for (const file of files) input[file.name] = file.data;
  return zipSync(input);
}
