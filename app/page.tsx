import { ApplicationForm } from "@/components/application-form";
import { FilterBar } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { MemberDirectory } from "@/components/member-directory";
import { SiteHeader } from "@/components/site-header";
import { getDirectoryPageData } from "@/lib/data/public";
import { parseDirectoryFilters } from "@/lib/utils/filters";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const filters = parseDirectoryFilters(resolvedSearchParams);
  const { members, tags, usingFallbackData } = await getDirectoryPageData(filters);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <Hero />
      <main className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-10 lg:py-14">
        <FilterBar filters={filters} tags={tags} />
        <MemberDirectory members={members} usingFallbackData={usingFallbackData} />
        <ApplicationForm tags={tags} />
      </main>
      <footer className="border-t border-line/70 px-6 py-8 text-center text-xs uppercase tracking-[0.28em] text-muted lg:px-10">
        ucsb.network · a focused directory for serious UCSB people
      </footer>
    </div>
  );
}
