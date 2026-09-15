import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  className?: string;
}

const PALETTE = ["gold", "success", "silver", "error"] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Deterministic hash so the same name always gets the same color, rather
    than one chosen at render time. */
function hashToIndex(name: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function Avatar({ name, className }: AvatarProps) {
  const variant = PALETTE[hashToIndex(name, PALETTE.length)];
  return (
    <span className={[styles.avatar, styles[`avatar--${variant}`], className].filter(Boolean).join(" ")}>
      {getInitials(name)}
    </span>
  );
}
