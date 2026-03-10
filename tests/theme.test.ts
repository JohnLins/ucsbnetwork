import { describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/lib/constants/theme";

describe("theme configuration", () => {
  it("uses a stable local storage key", () => {
    expect(THEME_STORAGE_KEY).toBe("ucsb-network-theme");
  });
});
