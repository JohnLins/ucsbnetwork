import { ApplicationForm } from "@/components/application-form";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Apply: ucsb.network",
  description:
    "Apply to the next ucsb.network accelerator cohort. Eight weeks, a dedicated mentor, a hackathon, Demo Day."
};

export default function ApplyPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">Application</p>
          <h1 className="mt-6 font-display text-display-lg tracking-tightest text-ink">
            Tell us what you&rsquo;re building.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">
            We read every application. Keep it short and specific: what
            you&rsquo;re building, who it&rsquo;s for, and what you&rsquo;ve
            shipped so far. If you&rsquo;re a non-student alum or operator who
            wants to help, this is also where you tell us.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <ApplicationForm />
        </div>
      </section>
    </MarketingShell>
  );
}
