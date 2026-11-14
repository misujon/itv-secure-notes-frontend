import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function formatDisplayDate(isoDate?: string | null): string {
  if (!isoDate) {
    return "—";
  }
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) {
    return "—";
  }
  return format(parsed, "MMM d, yyyy");
}

export function formatDateTime(isoDate?: string | null): string {
  if (!isoDate) {
    return "—";
  }
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) {
    return "—";
  }
  return format(parsed, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeDate(isoDate?: string | null): string {
  if (!isoDate) {
    return "—";
  }
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) {
    return "—";
  }
  return formatDistanceToNow(parsed, { addSuffix: true });
}
