type LogLevel = "debug" | "info" | "warn" | "error";

function scrub(input: unknown): unknown {
  if (typeof input === "string") {
    return input.replace(/ghp_[A-Za-z0-9]+/g, "[REDACTED_PAT]");
  }
  if (input && typeof input === "object") {
    const clone: any = Array.isArray(input) ? [] : {};
    for (const [k, v] of Object.entries(input as any)) {
      clone[k] = /pat/i.test(k) ? "[REDACTED]" : scrub(v);
    }
    return clone;
  }
  return input;
}

export function log(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta ? { meta: scrub(meta) } : undefined;
  // eslint-disable-next-line no-console
  console[level](`[${level}] ${message}`, payload ?? "");
}


