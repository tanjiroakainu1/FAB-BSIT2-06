import { DEVELOPMENT_TEAM } from '@shared/constants/team'
import { PageContainer } from '@shared/components'

export function TeamCreditsFooter() {
  return (
    <footer className="mt-auto border-t border-diamond-border bg-gradient-to-b from-diamond-surface to-diamond-bg py-6 sm:py-8">
      <PageContainer>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-crimson/50" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-widest text-diamond-muted">
            Development team
          </h2>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-crimson/50" aria-hidden />
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {DEVELOPMENT_TEAM.map(({ name, role }) => (
            <li
              key={name}
              className="group rounded-xl border border-diamond-border bg-diamond-card px-4 py-3 text-center shadow-sm transition-all duration-200 hover:border-crimson/30 hover:shadow-[0_0_20px_-6px_rgba(196,30,58,0.15)]"
            >
              <p className="text-sm font-semibold text-diamond truncate" title={name}>
                {name}
              </p>
              <span className="mt-1 inline-block rounded-md bg-crimson/10 px-2 py-0.5 text-xs font-medium text-crimson group-hover:bg-crimson/15">
                {role}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-diamond-muted">
          FAB-BSIT2-06 · Food Ordering Hermanas · Built with React &amp; TypeScript
        </p>
      </PageContainer>
    </footer>
  )
}
