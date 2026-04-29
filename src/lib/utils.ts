// Date and format helpers used across surfaces.

const BALI_TZ = "Asia/Makassar";

export function bukitNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: BALI_TZ })
  );
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: BALI_TZ,
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: BALI_TZ,
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: BALI_TZ,
  });
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return "Still night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function relativeDay(iso: string): string {
  const today = bukitNow();
  const date = new Date(iso);
  const diff = Math.floor(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return formatDateShort(iso);
  return formatDate(iso);
}
