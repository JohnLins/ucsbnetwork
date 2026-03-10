"use client";

import { startTransition, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { DirectoryFilters, Tag } from "@/lib/types";

type FilterBarProps = {
  filters: DirectoryFilters;
  tags: Tag[];
};

function getTagsByType(tags: Tag[], tagType: Tag["tagType"]) {
  return tags.filter((tag) => tag.tagType === tagType).sort((left, right) => left.name.localeCompare(right.name));
}

export function FilterBar({ filters, tags }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(filters.q);

  const roles = getTagsByType(tags, "role");
  const domains = getTagsByType(tags, "domain");
  const keywords = getTagsByType(tags, "keyword");

  function updateParams(next: DirectoryFilters) {
    const params = new URLSearchParams();

    if (next.q) {
      params.set("q", next.q);
    }

    if (next.roles.length) {
      params.set("roles", next.roles.join(","));
    }

    if (next.domains.length) {
      params.set("domains", next.domains.join(","));
    }

    if (next.keywords.length) {
      params.set("keywords", next.keywords.join(","));
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router.push(nextUrl, { scroll: false }));
  }

  function toggleValue(values: string[], value: string) {
    return values.includes(value)
      ? values.filter((entry) => entry !== value)
      : [...values, value];
  }

  return (
    <section
      id="directory"
      className="rounded-2xl border border-line/40 bg-panel/60 p-5 lg:p-7"
    >
      <div className="space-y-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateParams({
              ...filters,
              q: query.trim()
            });
          }}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search members..."
            className="h-11 flex-1 rounded-xl border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-accent px-5 text-xs font-medium uppercase tracking-widest text-white transition hover:opacity-90"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <FilterGroup
              items={roles}
              activeValues={filters.roles}
              onToggle={(slug) => updateParams({ ...filters, roles: toggleValue(filters.roles, slug) })}
            />
            <FilterGroup
              items={domains}
              activeValues={filters.domains}
              onToggle={(slug) => updateParams({ ...filters, domains: toggleValue(filters.domains, slug) })}
            />
            <FilterGroup
              items={keywords}
              activeValues={filters.keywords}
              onToggle={(slug) =>
                updateParams({ ...filters, keywords: toggleValue(filters.keywords, slug) })
              }
            />
          </div>
          <button
            type="button"
            className="shrink-0 text-xs text-muted transition hover:text-ink"
            onClick={() =>
              updateParams({
                q: "",
                roles: [],
                domains: [],
                keywords: []
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

type FilterGroupProps = {
  items: Tag[];
  activeValues: string[];
  onToggle: (slug: string) => void;
};

function FilterGroup({ items, activeValues, onToggle }: FilterGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((tag) => {
        const isActive = activeValues.includes(tag.slug);

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.slug)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              isActive
                ? "border-accent/60 bg-accent/10 text-ink"
                : "border-line/50 text-muted hover:border-line hover:text-ink"
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </>
  );
}
