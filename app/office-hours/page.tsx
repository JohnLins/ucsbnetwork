import { MarketingShell } from "@/components/marketing/marketing-shell";
import { OfficeHoursSignupForm } from "@/components/marketing/office-hours-signup-form";

export const metadata = {
  title: "Live Office Hours: ucsb.network",
  description:
    "Open office hours for anyone building at UCSB. Meet ucsb.network directors for a recorded session and feedback."
};

const LINKEDIN_LEON = "https://www.linkedin.com/in/leonkhoshnevis/";
const LINKEDIN_HURSH = "https://www.linkedin.com/in/hursh-shah/";

export default function OfficeHoursPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="eyebrow-accent">For UCSB builders</p>
          <h1 className="mt-6 font-display text-display-xl tracking-tightest text-ink">
            Live Office Hours
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">
            We&apos;re opening our exclusive in-batch office hours to anyone
            building anything at any stage at UCSB.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-display text-2xl text-ink">How it works</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/80">
            Sign up below with you or your cofounder. Briefly write about what
            you&apos;re working on, then schedule a time to meet with our
            directors. We&apos;ll have a 20-minute in-person recorded office
            hours where we&apos;ll break down every part of your project and
            help give you our perspective. Afterwards, with your permission
            we&apos;ll post office hours online.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-display text-2xl text-ink">
            Who you&apos;ll be talking to
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border border-ink/10 p-6">
              <p className="eyebrow text-ink">
                <a
                  href={LINKEDIN_LEON}
                  className="link-editorial"
                  target="_blank"
                  rel="noreferrer"
                >
                  Leon Khoshnevis
                </a>
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/80">
                I&apos;m the founder of Playa House, prev co-founded SBVenture,
                and Correkt AI (multimodal AI search engine, 40K users), and led
                Neuro research my 1st year @ UCSB.
              </p>
            </div>
            <div className="border border-ink/10 p-6">
              <p className="eyebrow text-ink">
                <a
                  href={LINKEDIN_HURSH}
                  className="link-editorial"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hursh Shah
                </a>
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/80">
                I&apos;m the founder of Edviro and ucsb.network, previously
                co-founded SkyGlass (AR for pilot pre-flight inspections),
                wrote and presented my paper at NeurIPS 2024 GenAI4Health, and
                was selected for OpenAI&apos;s ChatGPT Lab (1 of 30 students).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">Sign up</p>
          <h2 className="mt-4 font-display text-display-sm text-ink">
            Request a slot
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
            We read every submission and follow up by text or email to
            coordinate time on campus.
          </p>
          <div className="mt-10 border border-ink/10 p-8 sm:p-10">
            <OfficeHoursSignupForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
