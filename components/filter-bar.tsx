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
      className="rounded-[2rem] border border-line/80 bg-panel/85 p-5 shadow-halo backdrop-blur lg:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-accent">Search the network</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Find the right people by craft, domain, and signal.</h2>
        </div>
        <button
          type="button"
          className="text-sm text-muted transition hover:text-ink"
          onClick={() =>
            updateParams({
              q: "",
              roles: [],
              domains: [],
              keywords: []
            })
          }
        >
          Reset filters
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Search by name</label>
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
              placeholder="Search for people by name"
              className="h-14 flex-1 rounded-full border border-line/80 bg-paper px-6 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent/50"
            />
            <button
              type="submit"
              className="h-14 rounded-full border border-accent/40 bg-accent/10 px-6 text-xs uppercase tracking-[0.28em] text-ink transition hover:bg-accent/20"
            >
              Search
            </button>
          </form>
        </div>

        <FilterGroup
          title="Roles"
          items={roles}
          activeValues={filters.roles}
          onToggle={(slug) => updateParams({ ...filters, roles: toggleValue(filters.roles, slug) })}
        />
        <FilterGroup
          title="Domains"
          items={domains}
          activeValues={filters.domains}
          onToggle={(slug) => updateParams({ ...filters, domains: toggleValue(filters.domains, slug) })}
        />
        <FilterGroup
          title="Keywords"
          items={keywords}
          activeValues={filters.keywords}
          onToggle={(slug) =>
            updateParams({ ...filters, keywords: toggleValue(filters.keywords, slug) })
          }
        />
      </div>
    </section>
  );
}

type FilterGroupProps = {
  title: string;
  items: Tag[];
  activeValues: string[];
  onToggle: (slug: string) => void;
};

function FilterGroup({ title, items, activeValues, onToggle }: FilterGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.32em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((tag) => {
          const isActive = activeValues.includes(tag.slug);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.slug)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent bg-accent/12 text-ink"
                  : "border-line/80 bg-paper/70 text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
