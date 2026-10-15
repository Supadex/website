import { ArrowDownToLine, ArrowRight, BookOpen, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const chapters = [
  ['01', 'Architecture', 'How the manager, vault and specialized engines form the singleton topology.'],
  ['02', 'Liquidity models', 'Concentrated ranges, active-bin liquidity and the amplified stable invariant.'],
  ['03', 'Execution', 'The unlock callback, curve dispatch, fee handling and zero-delta settlement lifecycle.'],
  ['04', 'LVR research', 'What loss-versus-rebalancing means—and what the current adaptive-fee experiment does not guarantee.'],
  ['05', 'Security & status', 'Threat boundaries, repository evidence, known limitations and validation milestones.'],
];

export function WhitepaperPage() {
  return (
    <div className="py-8 sm:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end border-b border-hairline-theme pb-14 sm:pb-20">
        <div>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500 dark:text-sky-400">
            Technical publication · v1.0.0
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-primary-theme sm:text-6xl lg:text-7xl">
            The exchange architecture, without the shortcuts.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-secondary-theme sm:text-lg">
            An implementation-led account of SupaDAO DEX: one coordination and settlement layer, three liquidity engines, explicit trust boundaries, and candid limitations.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/documents/SupaDAO_DEX_Whitepaper.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary-theme px-5 py-2.5 text-sm font-semibold text-accent-primary-text transition-opacity hover:opacity-85"
            >
              <ArrowDownToLine className="h-4 w-4" /> Download PDF
            </a>
            <a
              href="/documents/SupaDAO_DEX_Whitepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-theme px-5 py-2.5 text-sm font-medium text-primary-theme hover:bg-subtle-theme"
            >
              Read in browser <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <aside className="rounded-3xl border border-hairline-theme bg-surface-theme p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-hairline-theme pb-5">
            <BookOpen className="h-5 w-5 text-sky-500 dark:text-sky-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-tertiary-theme">Under technical review</span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
            <div><dt className="text-xs text-tertiary-theme">Published</dt><dd className="mt-1 text-primary-theme">15 Oct 2026</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Format</dt><dd className="mt-1 text-primary-theme">8-page PDF</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Evidence</dt><dd className="mt-1 text-primary-theme">Repository-derived</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Audit status</dt><dd className="mt-1 text-primary-theme">Not independently audited</dd></div>
          </dl>
          <p className="mt-7 border-l-2 border-amber-500 pl-4 text-xs leading-5 text-secondary-theme">
            No public-network deployment was confirmed. The LVR module is documented as experimental and includes a known tick-observation limitation.
          </p>
        </aside>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div><p className="text-xs uppercase tracking-widest text-tertiary-theme">Reading map</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary-theme">Five questions, answered from source.</h2></div>
          <FileCheck2 className="hidden h-8 w-8 text-secondary-theme sm:block" />
        </div>
        <div className="divide-y divide-hairline-theme border-y border-hairline-theme">
          {chapters.map(([number, title, description]) => (
            <div key={number} className="grid gap-3 py-7 sm:grid-cols-[64px_220px_1fr] sm:items-baseline">
              <span className="font-mono text-xs text-sky-500 dark:text-sky-400">{number}</span>
              <h3 className="text-lg font-semibold text-primary-theme">{title}</h3>
              <p className="max-w-2xl text-sm leading-6 text-secondary-theme">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-hairline-theme bg-surface-theme p-7 sm:p-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div><p className="font-mono text-xs text-sky-500 dark:text-sky-400">SHARED CORE</p><p className="mt-3 text-sm leading-6 text-secondary-theme">The manager dispatches pool behavior; the vault centralizes custody, claims and transient settlement.</p></div>
          <div><p className="font-mono text-xs text-sky-500 dark:text-sky-400">SPECIALIZED MATH</p><p className="mt-3 text-sm leading-6 text-secondary-theme">CLAMM, bin and stable engines share an execution envelope—not an invariant or automatically merged liquidity.</p></div>
          <div><p className="font-mono text-xs text-sky-500 dark:text-sky-400">MEASURED CLAIMS</p><p className="mt-3 text-sm leading-6 text-secondary-theme">Tests support implementation claims. They do not establish an audit, production readiness, or guaranteed economic performance.</p></div>
        </div>
        <div className="mt-9 border-t border-hairline-theme pt-7">
          <Link to="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-theme hover:text-sky-500">
            Continue to developer material <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
