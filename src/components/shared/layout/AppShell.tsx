import type { ReactNode } from 'react'

type AppShellProps = {
  classNamePrefix?: string
  glow?: boolean
  sidebar: ReactNode
  header?: ReactNode
  stats?: ReactNode
  children: ReactNode
}

const AppShell = ({
  classNamePrefix = 'pm',
  glow = true,
  sidebar,
  header,
  stats,
  children,
}: AppShellProps) => (
  <div className={`${classNamePrefix}-app`}>
    {glow && (
      <>
        <div className={`${classNamePrefix}-glow ${classNamePrefix}-glow-left`} />
        <div className={`${classNamePrefix}-glow ${classNamePrefix}-glow-right`} />
      </>
    )}
    <div className={`${classNamePrefix}-sidebar`}>{sidebar}</div>
    <div className={`${classNamePrefix}-workspace`}>
      <main className={`${classNamePrefix}-main`}>
        {header && <div className={`${classNamePrefix}-header`}>{header}</div>}
        <div className={`${classNamePrefix}-body`}>
          {stats && <div className={`${classNamePrefix}-stats-row`}>{stats}</div>}
          <div className={`${classNamePrefix}-content`}>{children}</div>
        </div>
      </main>
    </div>
  </div>
)

export default AppShell
