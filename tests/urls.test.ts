import { describe, expect, it } from "vitest";

import { isSafeExternalUrl, normalizeOptionalUrl } from "@/lib/utils/urls";

describe("url helpers", () => {
  it("normalizes host-only urls to https", () => {
    expect(normalizeOptionalUrl("example.com")).toBe("https://example.com");
  });

  it("rejects unsafe protocols", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
  });
});
