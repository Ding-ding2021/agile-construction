import type { ReactNode } from 'react'

type AppShellProps = {
  rootClassName: string
  sidebar: ReactNode
  header?: ReactNode
  children: ReactNode
  workspaceClassName: string
  mainClassName: string
  glowClassPrefix?: string
}

const AppShell = ({
  rootClassName,
  sidebar,
  header,
  children,
  workspaceClassName,
  mainClassName,
  glowClassPrefix,
}: AppShellProps) => {
  return (
    <div className={rootClassName}>
      {glowClassPrefix ? (
        <>
          <div className={`${glowClassPrefix} ${glowClassPrefix}-left`} />
          <div className={`${glowClassPrefix} ${glowClassPrefix}-right`} />
        </>
      ) : null}

      {sidebar}

      <div className={workspaceClassName}>
        <main className={mainClassName}>
          {header}
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
