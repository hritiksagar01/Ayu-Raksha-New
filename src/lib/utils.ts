import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a stable 12-digit numeric Patient ID from any string id (e.g., UUID)
export function getPatientDisplayId(sourceId: string | undefined | null): string {
  if (!sourceId) return "000000000000";
  // If already numeric, normalize to last 12 digits
  const numeric = sourceId.replace(/\D/g, "");
  if (numeric.length >= 12) {
    return numeric.slice(-12);
  }
  // Fallback: make a numeric hash (safe within JS number range) and pad to 12 digits
  let hash = 5381; // djb2 seed
  for (let i = 0; i < sourceId.length; i++) {
    hash = ((hash << 5) + hash + sourceId.charCodeAt(i)) >>> 0; // 32-bit unsigned
  }
  // Mix again to expand space
  hash = (hash * 2654435761) >>> 0; // Knuth multiplicative hash
  const mod = 1_000_000_000_000; // 10^12
  const idNum = hash % mod;
  return String(idNum).padStart(12, "0");
}
