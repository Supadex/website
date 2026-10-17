import { ArrowDownToLine, ArrowRight, BookOpen, FileCheck2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const chapters = [
  ['01', 'Architecture', 'How the manager, vault and specialized engines form the singleton topology.'],
  ['02', 'Liquidity models', 'Concentrated ranges, active-bin liquidity and the amplified stable invariant.'],
  ['03', 'Execution', 'The unlock callback, curve dispatch, fee handling and zero-delta settlement lifecycle.'],
  ['04', 'LVR research', 'What loss-versus-rebalancing means—and what the current adaptive-fee experiment does not guarantee.'],
  ['05', 'Security & status', 'Threat boundaries, repository evidence, known limitations and validation milestones.'],
];

const documents = [
  {
    title: 'SupaDAO DEX White Paper',
    description: 'Flagship technical paper presenting the unified singleton exchange architecture, multi-curve math, settlement, security and limitations.',
    pages: '8 Pages',
    filename: 'SupaDAO_DEX_Whitepaper.pdf',
    featured: true
  },
  {
    title: 'Protocol & Architecture Guide',
    description: 'Comprehensive technical breakdown of SupaPoolManager, SupaVault, curve dispatch engines and transient zero-delta flash accounting.',
    pages: '4 Pages',
    filename: 'SupaDAO_DEX_Protocol_Architecture.pdf'
  },
  {
    title: 'Developer Documentation',
    description: 'Contract addresses, Foundry setup, swap integration, pool creation, liquidity tokenization, events and custom errors.',
    pages: '4 Pages',
    filename: 'SupaDAO_DEX_Developer_Documentation.pdf'
  },
  {
    title: 'User Guide',
    description: 'Plain-English guide to concentrated liquidity, discrete bins, stable pools, ERC-6909 vault claims, fees and risk considerations.',
    pages: '3 Pages',
    filename: 'SupaDAO_DEX_User_Guide.pdf'
  },
  {
    title: 'Technical Brief',
    description: 'Executive summary for research partners, auditors and technical integrators detailing architectural rationale and roadmap milestones.',
    pages: '3 Pages',
    filename: 'SupaDAO_DEX_Technical_Brief.pdf'
  }
];

export function WhitepaperPage() {
  return (
    <div className="py-8 sm:py-14">
      {/* Hero Header with Official Brand Identity */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end border-b border-hairline-theme pb-14 sm:pb-20">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/assets/images/supadao-logo.png"
              alt="SupaDAO Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-sm border border-hairline-theme"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-400">
                Official Publication Suite · v1.0.0
              </span>
              <span className="text-xs text-tertiary-theme font-mono">
                SupaDAO Exchange Systems Research
              </span>
            </div>
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-primary-theme sm:text-6xl lg:text-7xl">
            The exchange architecture, without the shortcuts.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-secondary-theme sm:text-lg">
            An implementation-led account of SupaDAO DEX: one shared coordination and settlement layer, three specialized liquidity engines, explicit trust boundaries, and candid limitations.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/documents/SupaDAO_DEX_Whitepaper.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary-theme px-5 py-2.5 text-sm font-semibold text-accent-primary-text transition-opacity hover:opacity-85"
            >
              <ArrowDownToLine className="h-4 w-4" /> Download White Paper PDF
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
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-theme">Publication Metadata</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">Under technical review</span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
            <div><dt className="text-xs text-tertiary-theme">Release Date</dt><dd className="mt-1 font-medium text-primary-theme">15 Oct 2026</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Master Spec</dt><dd className="mt-1 font-medium text-primary-theme">8-Page Research Paper</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Evidence Level</dt><dd className="mt-1 font-medium text-primary-theme">Repository-Verified</dd></div>
            <div><dt className="text-xs text-tertiary-theme">Audit Status</dt><dd className="mt-1 font-medium text-primary-theme">Pending External Audit</dd></div>
          </dl>
          <p className="mt-7 border-l-2 border-amber-500 pl-4 text-xs leading-5 text-secondary-theme">
            Verified locally on Foundry. No public-network deployment was confirmed. The LVR module is documented as experimental and includes a known tick-observation limitation.
          </p>
        </aside>
      </section>

      {/* Complete Branded Document Library */}
      <section className="py-14 sm:py-20 border-b border-hairline-theme">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-tertiary-theme">Document Suite</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary-theme">Complete Publication Library</h2>
          </div>
          <span className="text-xs text-secondary-theme font-mono">5 Versioned Documents · A4 PDF Standard</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.filename}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                doc.featured
                  ? 'border-emerald-500/30 bg-emerald-500/[0.02] shadow-sm'
                  : 'border-hairline-theme bg-surface-theme'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${doc.featured ? 'text-emerald-500' : 'text-secondary-theme'}`} />
                    <span className="font-mono text-xs text-tertiary-theme">{doc.pages}</span>
                  </div>
                  {doc.featured && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                      FLAGSHIP
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-primary-theme">{doc.title}</h3>
                <p className="mt-2.5 text-xs leading-5 text-secondary-theme">{doc.description}</p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-hairline-theme/60">
                <a
                  href={`/documents/${doc.filename}`}
                  download
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-theme hover:text-emerald-500 transition-colors"
                >
                  <ArrowDownToLine className="h-3.5 w-3.5" /> PDF
                </a>
                <span className="text-tertiary-theme">·</span>
                <a
                  href={`/documents/${doc.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-secondary-theme hover:text-primary-theme transition-colors"
                >
                  Read Online <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading Map Section */}
      <section className="py-14 sm:py-20 border-b border-hairline-theme">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-tertiary-theme">Reading map</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary-theme">Five questions, answered from source.</h2>
          </div>
          <FileCheck2 className="hidden h-8 w-8 text-secondary-theme sm:block" />
        </div>
        <div className="divide-y divide-hairline-theme border-y border-hairline-theme">
          {chapters.map(([number, title, description]) => (
            <div key={number} className="grid gap-3 py-7 sm:grid-cols-[64px_220px_1fr] sm:items-baseline">
              <span className="font-mono text-xs text-emerald-500 dark:text-emerald-400">{number}</span>
              <h3 className="text-lg font-semibold text-primary-theme">{title}</h3>
              <p className="max-w-2xl text-sm leading-6 text-secondary-theme">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Summary Banner */}
      <section className="rounded-3xl border border-hairline-theme bg-surface-theme p-7 sm:p-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs text-emerald-500 dark:text-emerald-400">SHARED CORE</p>
            <p className="mt-3 text-sm leading-6 text-secondary-theme">
              The manager dispatches pool behavior; the vault centralizes custody, claims and transient zero-delta settlement.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-emerald-500 dark:text-emerald-400">SPECIALIZED MATH</p>
            <p className="mt-3 text-sm leading-6 text-secondary-theme">
              CLAMM, bin and stable engines share an execution envelope—not an invariant or automatically merged liquidity.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-emerald-500 dark:text-emerald-400">MEASURED CLAIMS</p>
            <p className="mt-3 text-sm leading-6 text-secondary-theme">
              Tests support implementation claims. They do not establish an audit, production readiness, or guaranteed economic performance.
            </p>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-hairline-theme pt-7">
          <Link to="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-theme hover:text-emerald-500 transition-colors">
            Continue to developer material <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="font-mono text-xs text-tertiary-theme">
            SupaDAO Research Publications · All rights reserved
          </span>
        </div>
      </section>
    </div>
  );
}
export default WhitepaperPage;
