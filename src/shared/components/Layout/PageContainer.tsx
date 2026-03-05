import { type ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 min-w-0 ${className}`}>
      {children}
    </div>
  )
}
