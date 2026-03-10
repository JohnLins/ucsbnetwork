export function normalizeOptionalUrl(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function isSafeExternalUrl(value?: string | null) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(normalizeOptionalUrl(value) ?? "");
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
