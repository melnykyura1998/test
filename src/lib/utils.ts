import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Returns a unique name by appending (1), (2), etc. if the desired name already
 * exists in the provided set of existing names.
 */
export function getUniqueName(desiredName: string, existingNames: string[]): string {
  const set = new Set(existingNames);
  if (!set.has(desiredName)) return desiredName;

  // Strip extension for files
  const lastDot = desiredName.lastIndexOf(".");
  const hasExt = lastDot > 0;
  const base = hasExt ? desiredName.slice(0, lastDot) : desiredName;
  const ext = hasExt ? desiredName.slice(lastDot) : "";

  let counter = 1;
  let candidate = `${base} (${counter})${ext}`;
  while (set.has(candidate)) {
    counter++;
    candidate = `${base} (${counter})${ext}`;
  }
  return candidate;
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot < 0) return "";
  return filename.slice(lastDot + 1).toLowerCase();
}
